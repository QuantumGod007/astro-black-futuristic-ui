
import React, { useState, useEffect } from 'react';
import { Calendar, Play, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QuizModal from '@/components/QuizModal';
import ApodViewer from '@/components/ApodViewer';
import LoadingSpinner from '@/components/LoadingSpinner';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizOpen, setQuizOpen] = useState(false);

  const API_KEY = "28y4Lrd2brs49m8vLu5jyi0yrl9GXzEZgTPAUcol";

  const fetchAPOD = async (date = selectedDate) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
      );
      const data = await response.json();
      setApodData(data);
    } catch (error) {
      console.error('Error fetching APOD:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD();
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchAPOD(newDate);
  };

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
            <Sparkles className="w-8 h-8 text-white" />
            <h1 className="text-5xl md:text-6xl font-thin tracking-tight">
              NASA APOD
            </h1>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Explore the cosmos through NASA's lens. Discover breathtaking imagery and scientific insights from our universe, one day at a time.
          </p>
        </header>

        {/* Controls */}
        <Card className="max-w-md mx-auto mb-12 bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-white drop-shadow-lg" />
                <label className="text-sm font-medium text-white">
                  Select Date
                </label>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => fetchAPOD(selectedDate)}
                  className="flex-1 bg-white text-black hover:bg-gray-100 transition-all duration-200"
                  disabled={loading}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {loading ? 'Loading...' : 'View APOD'}
                </Button>
                <Button
                  onClick={() => setQuizOpen(true)}
                  variant="outline"
                  className="border-white/70 text-white hover:bg-white/20 hover:border-white bg-white/10 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* APOD Content */}
        {!loading && apodData && <ApodViewer data={apodData} />}

        {/* Quiz Modal */}
        <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />
      </div>
    </div>
  );
};

export default Index;
