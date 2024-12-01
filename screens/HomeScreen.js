import React, { useState } from 'react';
import { View, TextInput, StatusBar, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export const theme = {
  bgWhite: (opacity) => `rgba(255, 255, 255, ${opacity})`,
};

export default function HomeScreen({ navigation }) {

  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([1, 2, 3]);

  // EVENT WHEN USER PRESS ON SEARCH RESULT
  const handleLocation = (loc) => {
    console.log("location: ", loc);
  };

  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" />

      {/* Background Image */}
      <Image
        blurRadius={70}
        source={require('../assets/bg.jpg')}
        style={homeStyles.fullScreenImage}
      />

      <SafeAreaView style={{margin: 10, flex: 1, flexDirection :'column'}}>

        {/* Search Section */}
        <View style={[homeStyles.searchSection]}>

          <View style={[{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }, homeStyles.searchBar]}>

            {
              showSearch ? (<TextInput
                placeholder="Search city..."
                cursorColor={'white'}
                placeholderTextColor="lightgray"
                style={homeStyles.searchInput}
              />) : null
            }

            {/* Search Icon */}
            <TouchableOpacity
              style={[homeStyles.searchIconContainer, { backgroundColor: theme.bgWhite(0.3) }]}
              onPress={() => toggleSearch(!showSearch)}
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
                              London, United Kingdom
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
            London, United Kingdom
          </Text>
        </View>

      </SafeAreaView>

    </View>
  );
}

const homeStyles = StyleSheet.create({
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
    alignItems: 'center',
    marginHorizontal: 4,
    justifyContent: 'center',
    top: 60,
    marginBottom: 4,
    width: '100%',
  },

  locationText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
  }
});
