import React, { useMemo, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Prediction, PlaceResult } from '../types';
import { fetchAutocompletePredictions, getPlaceDetails } from '../utils/route';

interface DestinationSearchProps {
  onDestinationSelect: (place: PlaceResult) => void;
}

export default function DestinationSearch({ onDestinationSelect }: DestinationSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { width } = useWindowDimensions();

  const responsiveStyles = useMemo(() => {
    const isSmallPhone = width < 360;
    const isTablet = width >= 768;

    const inputHorizontalPadding = isSmallPhone ? 20 : isTablet ? 32 : 24;
    const inputVerticalPadding = isSmallPhone ? 12 : isTablet ? 20 : 16;

    return {
      container: {
        maxWidth: isTablet ? 560 : 500,
      },
      input: {
        paddingHorizontal: inputHorizontalPadding,
        paddingVertical: inputVerticalPadding,
        fontSize: isSmallPhone ? 18 : isTablet ? 22 : 20,
      },
      dropdown: {
        maxHeight: isTablet ? 360 : 300,
      },
      dropdownScroll: {
        maxHeight: isTablet ? 360 : 300,
      },
      predictionItem: {
        paddingHorizontal: isSmallPhone ? 20 : 24,
        paddingVertical: isSmallPhone ? 12 : 16,
      },
      mainText: {
        fontSize: isSmallPhone ? 16 : isTablet ? 20 : 18,
      },
      secondaryText: {
        fontSize: isSmallPhone ? 13 : isTablet ? 16 : 14,
      },
    };
  }, [width]);

  const handleInputChange = async (value: string) => {
    setInputValue(value);

    if (!value.trim()) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const results = await fetchAutocompletePredictions(value);

      if (results && results.length > 0) {
        const convertedPredictions: Prediction[] = results.map((prediction) => ({
          description: prediction.description,
          place_id: prediction.place_id,
          structured_formatting: {
            main_text: prediction.structured_formatting.main_text,
            secondary_text: prediction.structured_formatting.secondary_text || '',
          },
        }));

        setPredictions(convertedPredictions);
        setShowDropdown(true);
      } else {
        setPredictions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectPrediction = async (placeId: string, description: string) => {
    setInputValue(description);
    setShowDropdown(false);
    setPredictions([]);

    try {
      const place = await getPlaceDetails(placeId);

      if (place && place.geometry && place.geometry.location) {
        const placeResult = {
          name: place.name,
          formatted_address: place.formatted_address,
          place_id: placeId,
          geometry: {
            location: {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
            },
          },
        };

        onDestinationSelect(placeResult);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, responsiveStyles.container]}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, responsiveStyles.input]}
          value={inputValue}
          onChangeText={handleInputChange}
          placeholder="Enter destination address..."
          placeholderTextColor="#9CA3AF"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* Dropdown */}
      {showDropdown && predictions.length > 0 && (
        <View style={[styles.dropdown, responsiveStyles.dropdown]}>
          <ScrollView
            style={[styles.dropdownScroll, responsiveStyles.dropdownScroll]}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
          >
            {predictions.map((item, index) => (
              <View key={item.place_id}>
                <TouchableOpacity
                  style={[styles.predictionItem, responsiveStyles.predictionItem]}
                  onPress={() => handleSelectPrediction(item.place_id, item.description)}
                >
                  <MapPin color="#9333EA" size={24} style={styles.icon} />
                  <View style={styles.predictionTextContainer}>
                    <Text style={[styles.mainText, responsiveStyles.mainText]}>
                      {item.structured_formatting.main_text}
                    </Text>
                    <Text style={[styles.secondaryText, responsiveStyles.secondaryText]}>
                      {item.structured_formatting.secondary_text}
                    </Text>
                  </View>
                </TouchableOpacity>
                {index < predictions.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 500,
    zIndex: 1000,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 20,
    fontWeight: '600',
    borderWidth: 4,
    borderColor: '#A855F7',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#D8B4FE',
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 300,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  icon: {
    marginTop: 4,
    marginRight: 12,
  },
  predictionTextContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
  separator: {
    height: 2,
    backgroundColor: '#E5E7EB',
  },
});
