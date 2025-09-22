import { Venue } from '../types/Match';

export const STADIUMS: Record<string, Venue> = {
  'Old Trafford': {
    name: 'Old Trafford',
    latitude: 53.4631,
    longitude: -2.2914,
    city: 'Manchester',
    capacity: '74,310'
  },
  'Emirates Stadium': {
    name: 'Emirates Stadium', 
    latitude: 51.5549,
    longitude: -0.1084,
    city: 'London',
    capacity: '60,704'
  },
  'Stamford Bridge': {
    name: 'Stamford Bridge',
    latitude: 51.4817,
    longitude: -0.1910,
    city: 'London',
    capacity: '40,341'
  },
  'Anfield': {
    name: 'Anfield',
    latitude: 53.4308,
    longitude: -2.9609,
    city: 'Liverpool',
    capacity: '53,394'
  },
  'Etihad Stadium': {
    name: 'Etihad Stadium',
    latitude: 53.4831,
    longitude: -2.2004,
    city: 'Manchester',
    capacity: '53,400'
  },
  'Tottenham Hotspur Stadium': {
    name: 'Tottenham Hotspur Stadium',
    latitude: 51.6042,
    longitude: -0.0664,
    city: 'London',
    capacity: '62,850'
  },
  'London Stadium': {
    name: 'London Stadium',
    latitude: 51.5388,
    longitude: -0.0166,
    city: 'London',
    capacity: '66,000'
  },
  'St. James\' Park': {
    name: 'St. James\' Park',
    latitude: 54.9756,
    longitude: -1.6219,
    city: 'Newcastle',
    capacity: '52,305'
  },
  'Villa Park': {
    name: 'Villa Park',
    latitude: 52.5097,
    longitude: -1.8847,
    city: 'Birmingham',
    capacity: '42,682'
  },
  'Goodison Park': {
    name: 'Goodison Park',
    latitude: 53.4388,
    longitude: -2.9664,
    city: 'Liverpool',
    capacity: '39,414'
  },
  'Craven Cottage': {
    name: 'Craven Cottage',
    latitude: 51.4749,
    longitude: -0.2217,
    city: 'London',
    capacity: '19,359'
  },
  'Selhurst Park': {
    name: 'Selhurst Park',
    latitude: 51.3983,
    longitude: -0.0856,
    city: 'London',
    capacity: '25,486'
  },
  'American Express Stadium': {
    name: 'American Express Stadium',
    latitude: 50.8612,
    longitude: -0.0835,
    city: 'Brighton',
    capacity: '31,800'
  },
  'Molineux Stadium': {
    name: 'Molineux Stadium',
    latitude: 52.5902,
    longitude: -2.1303,
    city: 'Wolverhampton',
    capacity: '31,700'
  },
  'Bramall Lane': {
    name: 'Bramall Lane',
    latitude: 53.3705,
    longitude: -1.4709,
    city: 'Sheffield',
    capacity: '32,050'
  },
  'Vitality Stadium': {
    name: 'Vitality Stadium',
    latitude: 50.7352,
    longitude: -1.8384,
    city: 'Bournemouth',
    capacity: '11,464'
  },
  'Turf Moor': {
    name: 'Turf Moor',
    latitude: 53.7890,
    longitude: -2.2309,
    city: 'Burnley',
    capacity: '21,944'
  },
  'Brentford Community Stadium': {
    name: 'Brentford Community Stadium',
    latitude: 51.4906,
    longitude: -0.2891,
    city: 'London',
    capacity: '17,250'
  },
  'The City Ground': {
    name: 'The City Ground',
    latitude: 52.9404,
    longitude: -1.1327,
    city: 'Nottingham',
    capacity: '30,445'
  },
  'Carrow Road': {
    name: 'Carrow Road',
    latitude: 52.6220,
    longitude: 1.3089,
    city: 'Norwich',
    capacity: '27,244'
  }
};

export function getStadiumData(venueName: string): Venue {
  const stadium = STADIUMS[venueName];
  if (stadium) {
    return stadium;
  }
  
  // fallback pour stades non référencés
  return {
    name: venueName,
    latitude: 51.5074,
    longitude: -0.1278,
    city: 'Unknown',
    capacity: 'N/A'
  };
}
