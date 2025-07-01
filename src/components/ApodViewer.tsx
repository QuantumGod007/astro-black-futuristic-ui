
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copyright, Calendar, Info } from 'lucide-react';

interface ApodViewerProps {
  data: {
    title: string;
    explanation: string;
    media_type: string;
    url: string;
    copyright?: string;
    date: string;
  };
}

const ApodViewer: React.FC<ApodViewerProps> = ({ data }) => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Title Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-thin mb-4 text-white">
          {data.title}
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date(data.date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Media Container */}
      <Card className="mb-8 bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
        <CardContent className="p-0">
          {data.media_type === 'image' ? (
            <img
              src={data.url}
              alt={data.title}
              className="w-full h-auto max-h-[70vh] object-cover"
              loading="lazy"
            />
          ) : (
            <div className="aspect-video">
              <iframe
                src={data.url}
                title={data.title}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="p-8">
          <div className="flex items-start gap-3 mb-6">
            <Info className="w-5 h-5 text-gray-300 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                About This Image
              </h3>
              <p className="text-gray-300 leading-relaxed text-base">
                {data.explanation}
              </p>
            </div>
          </div>

          {data.copyright && (
            <div className="flex items-center gap-2 pt-6 border-t border-white/10">
              <Copyright className="w-4 h-4 text-gray-400" />
              <Badge variant="outline" className="text-gray-300 border-white/20">
                © {data.copyright}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApodViewer;
