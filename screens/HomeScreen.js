import React, { useCallback, useEffect, useState } from 'react';
import { View, TextInput, StatusBar, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { debounce } from 'lodash';
import { fetchLocationsData, fetchForecastData } from '../api/weather';
import { weatherImages } from '../constants/constants';
import * as Progress from 'react-native-progress';
import { getData, storeData } from '../helper/asyncStorage';

export const theme = {
  bgWhite: (opacity) => `rgba(255, 255, 255, ${opacity})`,
};

export default function HomeScreen({ navigation }) {


  // call before application interface building get started
  useEffect(()=>{

    fetchMyWeatherData();

  },[]);

  // SET DEAULT DATA OR SET USER PREFERENCED DATA FROM ASYNC STORAGE
  const fetchMyWeatherData = async () => {

    let cityName = "Surat";
    let myCity = await getData('city');
    if (myCity) cityName = myCity;

    fetchForecastData({cityName: cityName, days: '7'}).then(data => {
      setWeather(data);
      setLoading(false);
    });
  };

  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const { current, location, forecast } = weather;


  const toggleSearchSection = () => {

    if (showSearch == false) {
      setLocations([]);
    }

    toggleSearch(!showSearch);
  };

  // EVENT WHEN USER PRESS ON SEARCH RESULT
  const handleLocation = (loc) => {
    // console.log("location: ", loc);
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    // fetch data for perticular location
    fetchForecastData({ cityName: loc.name, days: 7 }).then(
      data => {
        // console.log("Got Forecast: ", data);
        setWeather(data);
        setLoading(false);
        storeData('city', loc.name);
      }
    );

  };

  // HANDLE SEARCH EVENT WHEN USER START TYPING
  const handleSearch = (val) => {
    console.log("Search Value: ", val);

    // Fetch Locations
    if (val.length > 2) {
      fetchLocationsData({ cityName: val }).then(
        data => {
          // console.log("Got locations : ", data)
          setLocations(data);
        }
      );
    } else if (val.length == 0) {
      setLocations([]);
    }
  };


  // CALL SEARCH DATA EVERY 1200 SEOCENDS DEALY WHEN USER START TYPING
  const debounceHandleSearch = useCallback(debounce(handleSearch, 1200), []);

  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" />

      {/* Background Image */}
      <Image
        blurRadius={70}
        source={require("../assets/bg.jpg")}
        style={homeStyles.fullScreenImage}
      />

      {
        loading ? <View style = {homeStyles.loadingContainer}>

          <Progress.CircleSnail thickness={10} size={100} color="#0bb3b2"/>

        </View> :  
    

      <SafeAreaView style={{ marginVertical: 5, flex: 1, flexDirection: 'column', justifyContent: 'space-evenly' }}>

        {/* Search Section */}
        <View style={[homeStyles.searchSection]}>

          <View style={[{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }, homeStyles.searchBar]}>

            {
              showSearch ? (<TextInput
                onChangeText={(val) => debounceHandleSearch(val)}
                placeholder="Search city..."
                cursorColor={'white'}
                placeholderTextColor="lightgray"
                style={homeStyles.searchInput}
              />) : null
            }

            {/* Search Icon */}
            <TouchableOpacity
              style={[homeStyles.searchIconContainer, { backgroundColor: theme.bgWhite(0.3) }]}
              onPress={() => toggleSearchSection()}
            >
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Search Results */}
          <View>
            {
              locations.length > 0 && showSearch ?
                <View style={homeStyles.searchResult}>
                  {
                    locations.map(
                      (loc, index) => {

                        let showBorder = index + 1 !== locations.length;

                        return (
                          <TouchableOpacity
                            key={index}
                            style={[homeStyles.resultBox, { borderBottomWidth: showBorder ? 0.5 : 0 }]}
                            onPress={() => handleLocation(loc)}
                          >
                            <FontAwesome name="map-pin" size={21} color="grey" />
                            <Text style={homeStyles.resultText}>
                              {loc?.name}, {loc?.country}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )
                  }
                </View> : null
            }
          </View>
        </View>

        {/* Forecast Section */}
        <View style={[homeStyles.forecastColumn]}>


          {/* Location Text */}
          <Text style={[homeStyles.locationText]}>
            {location?.name},
            <Text style={homeStyles.subLoationText}>
              {" " + location?.country}
            </Text>
          </Text>



          {/*weather image*/}
          <View style={homeStyles.weatherImageContainer}>
            <Image source={weatherImages[current?.condition?.text]}
              style={homeStyles.weatherImage}
            />
          </View>


          {/*degree celsius*/}
          <View style={{ marginTop: 20, marginBottom: 50, alignItems: 'center' }}>

            <Text style={[homeStyles.locationText, { fontSize: 50 }]}>
              {current?.temp_c}&#176;c</Text>

            <Text style={homeStyles.weatherConditionText}>
              {current?.condition?.text}
            </Text>


          </View>


          {/*other stats*/}
          <View style={homeStyles.otherStat}>



            <View style={homeStyles.statImageLable}>

              <Image source={require("../assets/statImages/wind.png")} style={homeStyles.statImage} />

              <Text style={homeStyles.statText}>{current?.wind_kph}km</Text>

            </View>


            <View style={homeStyles.statImageLable}>

              <Image source={require("../assets/statImages/drop.png")} style={homeStyles.statImage} />

              <Text style={homeStyles.statText}>{current?.humidity}%</Text>

            </View>


            <View style={homeStyles.statImageLable}>

              <Image source={require("../assets/statImages/sun.png")} style={homeStyles.statImage} />

              <Text style={homeStyles.statText}>{forecast?.forecastday[0]?.astro?.sunrise}</Text>

            </View>

          </View>

          {/*forecast section for next coming  days*/}
          <View style={homeStyles.nextDayForecastSection} >

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginLeft: 20 }}>

              <FontAwesome name='calendar' color={'lightgray'} size={18} />

              <Text style={[homeStyles.statText, { fontSize: 16 }]}>
                Daily Forecast
              </Text>

            </View>


            {/*horizontal forecast scroll view*/}
            <ScrollView
              horizontal
              contentContainerStyle={{ marginHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >


              {
                forecast?.forecastday?.map(
                  (data, index) => {


                  let date = new Date(data?.date);
                  let options = {weekday: 'long'};
                  let dayName = date.toLocaleDateString('en-US', options);
                  dayName = dayName.split(',')[0]


                    return (
                      <View 
                      key={index}
                      style={[homeStyles.nextForecastBox, { backgroundColor: theme.bgWhite(0.15) }]} >

                        <Image source={weatherImages[data?.day?.condition?.text]} style={homeStyles.nextForecastImage} />

                        <Text style={[homeStyles.statText, {fontSize: 14, letterSpacing: 0.5}]}>{dayName}</Text>


                        <Text style={[homeStyles.statText, { fontWeight: 'bold', fontSize: 18}]} >23&#176;</Text>

                      </View>
                    )
                  }
                )
              }



            </ScrollView>


          </View>

        </View>

      </SafeAreaView>
      }

    </View>
  );
}

const homeStyles = StyleSheet.create({

  loadingContainer: {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  fullScreenImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  searchSection: {
    marginHorizontal: 10,
    height: '7%',
    zIndex: 2, // Ensures it stays on top
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 16,
    paddingRight: 6,
    height: 60,
    borderRadius: 50,
  },
  searchInput: {
    fontSize: 18,
    color: 'white',
    flex: 1,
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 50,

  },
  searchResult: {
    position: 'absolute',
    width: '100%',
    top: 10,
    borderRadius: 20,
    paddingTop: 10,
    backgroundColor: 'lightgray',
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderRadius: 10,
    margin: 8,
    backgroundColor: 'lightgray',
    borderColor: 'gray',
  },
  resultText: {
    marginLeft: 10,
    fontSize: 18,
  },

  forecastColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    top: 20,
    marginBottom: 4,
    width: '100%',
  },

  locationText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
  },

  subLoationText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'lightgray',
    paddingLeft: 8,
  },

  weatherImageContainer: {
    marginVertical: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  weatherImage: {
    resizeMode: 'cover',
    height: 200,
    width: 200,
  },

  weatherConditionText: {
    fontSize: 20,
    color: 'white',
    letterSpacing: 2,
    marginVertical: 6,
    textAlign: 'center',
  },

  otherStat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 20,
  },

  statImageLable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },

  statImage: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
    tintColor: 'lightgray',
  },

  statText: {
    fontSize: 17,
    fontWeight: '600',
    marginHorizontal: 10,
    color: 'lightgray',
    letterSpacing: 2,
    textAlign: 'center'
  },

  nextDayForecastSection: {
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'flex-start',
  },

  nextForecastBox: {
    flex: 'column',
    height: 120,
    width: 100,
    justifyContent: 'space-evenly',
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 20,
    marginVertical: 15,
  },

  nextForecastImage: {
    height: 38,
    width: 38,
    resizeMode: 'contain',
  }
});
