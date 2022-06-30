from asyncio.windows_events import NULL
from geopy.geocoders import Nominatim
from genericpath import exists
from datetime import datetime
from os import listdir, rename
import pandas as pd
import numpy as np
import gpxpy 
import gpxpy.gpx 
import json

def main():

    for path in listdir('RUN2.Data\\RawData\\'):

        gpx_file = open('RUN2.Data\\RawData\\' + path, 'r')
        gpx = gpxpy.parse(gpx_file)
        gpx_file.close()

        newfile_name = gpx.tracks[0].name + ' ' + gpx.time.strftime('%Y-%m-%d') + '.json'

        if exists('RUN2.WebUI\\src\\CleanData\\' + newfile_name):
            continue

        run_dataframe = []
        for segment in gpx.tracks[0].segments:

            index = 0
            while index < len(segment.points):

                try:

                    geolocator = Nominatim(user_agent="geoapiExercises")
                    loc = geolocator.reverse(str(segment.points[index].latitude) + ',' + str(segment.points[index].longitude))
                    address = loc.raw['address']

                    run_dataframe.append({
                        'Latitude': segment.points[index].latitude, 
                        'Longitude': segment.points[index].longitude, 
                        'Elevation': segment.points[index].elevation, 
                        'Time': segment.points[index].time.strftime('%m/%d/%Y, %H:%M:%S'), 
                        'Speed': segment.points[index].speed, 
                        'Distance': NULL,
                        'Street': address.get('road','')
                    })

                    print(address.get('road',''))
                    index += 1

                except:

                    print('geolocator FAILURE')

        big_list = []
        temp_list = []
        for index in range(len(run_dataframe)):
            if temp_list == []:
                temp_list.append(index)
            else:
                if run_dataframe[index]['Street'] == run_dataframe[index-1]['Street']:
                    temp_list.append(index)
                else:
                    if len(temp_list) <= 5:
                        big_list = big_list + temp_list
                    temp_list = [index]

        for x in big_list[::-1]:
            print('Deleting: ' + run_dataframe[x]['Street'])
            del run_dataframe[x]

        for index in range(len(run_dataframe)-1):

            # https://stackoverflow.com/questions/45840118/how-do-i-calculate-speed-from-a-gpx-file-if-the-speed-tag-itself-is-not-given
            r = 6371000 # radius of the Earth in meters
            theta = np.deg2rad(run_dataframe[index]['Longitude'])
            phi = np.deg2rad(run_dataframe[index]['Latitude'])
            x = r*np.cos(theta)*np.sin(phi)
            y = r*np.sin(theta)*np.sin(phi)
            z = r*np.cos(phi)
            
            theta = np.deg2rad(run_dataframe[index+1]['Longitude'])
            phi = np.deg2rad(run_dataframe[index+1]['Latitude'])
            x2 = r*np.cos(theta)*np.sin(phi)
            y2 = r*np.sin(theta)*np.sin(phi)
            z2 = r*np.cos(phi)

            central_angle = np.arccos((x*x2 + y*y2 + z*z2)/r**2)
            arclength = central_angle*r
            time = (datetime.strptime(run_dataframe[index+1]['Time'], '%m/%d/%Y, %H:%M:%S') - datetime.strptime(run_dataframe[index]['Time'], '%m/%d/%Y, %H:%M:%S')) / pd.Timedelta(seconds=1)
            
            run_dataframe[index]['Distance'] = arclength / 1609
            run_dataframe[index]['Speed'] = (arclength / time) * 2.237 # in miles/hours

        run_dataframe[-1]['Speed'] = run_dataframe[-2]['Speed']
        
        output = json.dumps(run_dataframe, indent=2) 
        output_file = open('RUN2.WebUI\\src\\CleanData\\' + newfile_name, 'w')    
        output_file.write(output)
        output_file.close()  

        print('RUN2.WebUI\\src\\CleanData\\' + newfile_name)

if __name__=="__main__":

    main()