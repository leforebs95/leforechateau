import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative h-screen">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80")'
        }}
      />
      
      {/* Simple dark overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          Your Perfect<br />Beach Getaway
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-white">
          Experience luxury living with breathtaking ocean views and private beach access
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Book Your Stay
          </button>
          <button 
            onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white/10 text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/20 transition-all"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 