
import React, { useState, useEffect } from 'react';
import { Satellite, Globe, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import ISSMap from '@/components/ISSMap';

interface NEO {
  id: string;
  name: string;
  estimated_diameter: {
    meters: {
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    miss_distance: {
      kilometers: string;
    };
    relative_velocity: {
      kilometers_per_hour: string;
    };
  }>;
}

interface ISSPosition {
  latitude: number;
  longitude: number;
}

interface Astronaut {
  name: string;
  craft: string;
}

const NeoTracker = () => {
  const [neos, setNeos] = useState<NEO[]>([]);
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
  const [astronauts, setAstronauts] = useState<Astronaut[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "28y4Lrd2brs49m8vLu5jyi0yrl9GXzEZgTPAUcol";

  const fetchNEOs = async () => {
    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?api_key=${API_KEY}`
      );
      const data = await response.json();
      const allNeos = Object.values(data.near_earth_objects).flat() as NEO[];
      setNeos(allNeos.slice(0, 12));
    } catch (error) {
      console.error('Error fetching NEO data:', error);
    }
  };

  const fetchISSPosition = async () => {
    try {
      const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      const data = await response.json();
      setIssPosition({
        latitude: data.latitude,
        longitude: data.longitude
      });
    } catch (error) {
      console.error('Error fetching ISS position:', error);
    }
  };

  const fetchAstronauts = async () => {
    try {
      const response = await fetch('http://api.open-notify.org/astros.json');
      const data = await response.json();
      setAstronauts(data.people.filter((person: Astronaut) => person.craft === 'ISS'));
    } catch (error) {
      console.error('Error fetching astronaut data:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchNEOs(), fetchISSPosition(), fetchAstronauts()]);
      setLoading(false);
    };

    loadData();

    // Update ISS position every 5 seconds
    const interval = setInterval(fetchISSPosition, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <Globe className="w-8 h-8 text-white" />
            <h1 className="text-5xl md:text-6xl font-thin tracking-tight">
              NEO & ISS Tracker
            </h1>
            <Satellite className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Track Near-Earth Objects and the International Space Station in real-time. 
            Discover what's flying close to our planet today.
          </p>
        </header>

        {/* NEO Section */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-8">
            <AlertTriangle className="w-6 h-6 text-white" />
            <h2 className="text-3xl font-thin text-white">Near-Earth Objects Today</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {neos.map((neo) => (
              <Card
                key={neo.id}
                className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 hover-lift"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-medium text-white truncate">
                      {neo.name.replace(/[()]/g, '')}
                    </h3>
                    {neo.is_potentially_hazardous_asteroid ? (
                      <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Distance</p>
                      <p className="text-white font-medium">
                        {parseInt(neo.close_approach_data[0]?.miss_distance.kilometers || '0').toLocaleString()} km
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400">Speed</p>
                      <p className="text-white font-medium">
                        {parseInt(neo.close_approach_data[0]?.relative_velocity.kilometers_per_hour || '0').toLocaleString()} km/h
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400">Diameter</p>
                      <p className="text-white font-medium">
                        ~{parseInt(neo.estimated_diameter.meters.estimated_diameter_max).toLocaleString()} m
                      </p>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`w-full justify-center ${
                        neo.is_potentially_hazardous_asteroid 
                          ? 'border-orange-400/50 text-orange-300 bg-orange-400/10' 
                          : 'border-green-400/50 text-green-300 bg-green-400/10'
                      }`}
                    >
                      {neo.is_potentially_hazardous_asteroid ? '⚠️ Hazardous' : '✅ Safe'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ISS Section */}
        <section>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Satellite className="w-6 h-6 text-white" />
            <h2 className="text-3xl font-thin text-white">International Space Station</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-6 text-center">
                <Navigation className="w-8 h-8 mx-auto mb-4 text-blue-400" />
                <h3 className="text-lg font-medium text-white mb-2">Current Position</h3>
                {issPosition && (
                  <div className="space-y-1">
                    <p className="text-white">
                      <span className="text-gray-400">Lat:</span> {issPosition.latitude.toFixed(4)}°
                    </p>
                    <p className="text-white">
                      <span className="text-gray-400">Lng:</span> {issPosition.longitude.toFixed(4)}°
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-white mb-4 text-center">
                  👨‍🚀 Current Crew
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {astronauts.map((astronaut, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="border-blue-400/50 text-blue-300 bg-blue-400/10"
                    >
                      {astronaut.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-white mb-4 text-center">Live ISS Location</h3>
              <ISSMap position={issPosition} />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default NeoTracker;
