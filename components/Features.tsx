import React from 'react';

const features = [
  {
    title: 'Ocean Views',
    description: 'Wake up to stunning panoramic ocean views from every room',
    icon: '🌊',
    color: 'bg-blue-50'
  },
  {
    title: 'Private Beach',
    description: 'Direct access to your own private beach area',
    icon: '🏖️',
    color: 'bg-amber-50'
  },
  {
    title: 'Modern Kitchen',
    description: 'Fully equipped gourmet kitchen with high-end appliances',
    icon: '🍳',
    color: 'bg-green-50'
  },
  {
    title: 'Smart Home',
    description: 'Advanced home automation and security systems',
    icon: '🏠',
    color: 'bg-purple-50'
  },
  {
    title: 'Outdoor Living',
    description: 'Spacious deck with BBQ and outdoor dining area',
    icon: '🌅',
    color: 'bg-orange-50'
  },
  {
    title: 'AI Concierge',
    description: '24/7 AI-powered concierge service for all your needs',
    icon: '🤖',
    color: 'bg-indigo-50'
  }
];

const Features = () => {
  return (
    <div className="section bg-background" id="features-section">
      <div className="container-custom">
        <div className="text-center animate-fade-in">
          <h2 className="text-4xl font-bold text-text mb-4">
            Luxury Amenities
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
            Everything you need for a perfect beach vacation
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`card ${feature.color} hover:bg-white group`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </span>
                <h3 className="text-xl font-semibold text-text">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features; 