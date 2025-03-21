import Head from 'next/head'
import { useState } from 'react'
import BookingForm from '../components/BookingForm'
import HeroSection from '../components/HeroSection'
import Features from '../components/Features'
import Header from '../components/Header'

export default function Home() {
  const [bookingComplete, setBookingComplete] = useState(false)
  const basePrice = 250 // Base price per night in USD

  const handleBookingComplete = (bookingId: number) => {
    setBookingComplete(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>Luxury Beach House Rental</title>
        <meta name="description" content="Experience luxury living with our beautiful beach house rental. Direct bookings with no extra fees." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <div className="relative">
          <HeroSection />
        </div>
        
        {bookingComplete ? (
          <div className="container-custom my-16">
            <div className="card bg-green-50 text-center animate-fade-in">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                Booking Confirmed!
              </h2>
              <p className="text-green-600 mb-6">
                Thank you for your booking. You will receive a confirmation email shortly with all the details.
              </p>
              <button
                onClick={() => setBookingComplete(false)}
                className="btn-primary bg-green-600 hover:bg-green-700"
              >
                Book Another Stay
              </button>
            </div>
          </div>
        ) : (
          <>
            <Features />

            <div className="section bg-white" id="booking-section">
              <div className="absolute inset-0 bg-gradient-to-b from-background to-white h-1/2"></div>
              <div className="container-custom relative">
                <div className="text-center mb-12 animate-fade-in">
                  <h2 className="text-4xl font-bold text-text mb-4">
                    Book Your Stay
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Select your dates and enjoy our special rates starting from ${basePrice} per night
                  </p>
                </div>

                <BookingForm
                  basePrice={basePrice}
                  onBookingComplete={handleBookingComplete}
                />
              </div>
            </div>

            <div className="section bg-primary text-white">
              <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="card bg-primary-light bg-opacity-10">
                    <h3 className="text-2xl font-semibold mb-6">Location</h3>
                    <p className="text-gray-100 mb-4">
                      Our luxury beach house is located in a prime location with easy access to:
                    </p>
                    <ul className="space-y-2 text-gray-100">
                      <li className="flex items-center"><span className="mr-2">🌊</span> 30 seconds walk to the beach</li>
                      <li className="flex items-center"><span className="mr-2">🍽️</span> 5 minutes to local restaurants and shops</li>
                      <li className="flex items-center"><span className="mr-2">🏙️</span> 15 minutes to downtown</li>
                      <li className="flex items-center"><span className="mr-2">✈️</span> 25 minutes to the airport</li>
                    </ul>
                  </div>
                  <div className="card bg-primary-light bg-opacity-10">
                    <h3 className="text-2xl font-semibold mb-6">Contact</h3>
                    <p className="text-gray-100 mb-4">
                      Have questions? Our AI concierge is available 24/7, or reach out to us directly:
                    </p>
                    <ul className="space-y-2 text-gray-100">
                      <li className="flex items-center"><span className="mr-2">📧</span> Email: info@beachhouse.com</li>
                      <li className="flex items-center"><span className="mr-2">📞</span> Phone: (555) 123-4567</li>
                      <li className="flex items-center"><span className="mr-2">💬</span> Chat: Available 24/7</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-primary text-gray-200 py-8">
        <div className="container-custom text-center">
          <p>© {new Date().getFullYear()} Beach House Rental. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
} 