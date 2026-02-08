import { useState, useRef, useEffect } from 'react';
import { Heart, Gift, Sparkles, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [answered, setAnswered] = useState(false);
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [revealedGifts, setRevealedGifts] = useState<boolean[]>([false, false, false]);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noButtonSize, setNoButtonSize] = useState(100);
  const [yesButtonSize, setYesButtonSize] = useState(100);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Try to autoplay the audio when component mounts
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    }

    // Countdown timer
    const calculateTimeLeft = () => {
      const valentinesDay = new Date('2026-02-14T00:00:00');
      const now = new Date();
      const difference = valentinesDay.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleYes = () => {
  if (audioRef.current) {
    audioRef.current.volume = 0.6;
    audioRef.current.play().catch(() => {});
  }
  setAnswered(true);
};

  const handleBack = () => {
    setAnswered(false);
    setSelectedGift(null);
    setRevealedGifts([false, false, false]);
    setNoButtonPosition({ x: 0, y: 0 });
    setNoButtonSize(100);
    setYesButtonSize(100);
  };

  const handleNoHover = () => {
    // Move the button to a random position on desktop
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 100;
    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;
    
    setNoButtonPosition({ x: randomX, y: randomY });
  };

  const handleNoTouch = () => {
    // Decrease size of No button and increase Yes button on mobile
    setNoButtonSize(prev => Math.max(prev - 15, 20));
    setYesButtonSize(prev => Math.min(prev + 15, 200));
  };

  const handleGiftClick = (index: number) => {
    const newRevealed = [...revealedGifts];
    newRevealed[index] = !newRevealed[index]; // Toggle between revealed and hidden
    setRevealedGifts(newRevealed);
    
    // Only set as selected if it's being revealed
    if (newRevealed[index]) {
      setSelectedGift(index);
    } else if (selectedGift === index) {
      setSelectedGift(null);
    }
  };

  const gifts = [
    {
      icon: '🌹',
      name: 'A Bouquet of Flowers',
      description: 'Beautiful Flowers as you are , just for you',
    },
    {
      icon: '🎁',
      name: 'mystery box',
      description: 'A surprise gift that will make your heart skip a beat',
    },
    {
      icon: '💝',
      name: 'Romantic Dinner',
      description: 'A special dinner for two, filled with love and delicious food',
    },
  ];

  if (answered) {
    return (
      <div className="size-full min-h-screen bg-gradient-to-br from-rose-900 via-rose-800 to-amber-900 flex items-center justify-center p-4 overflow-hidden relative">
        {/* Background decoration */}
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541921647959-8a0850bde8c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcm9tYW50aWMlMjBjYW5kbGVsaWdodHxlbnwxfHx8fDE3NzA1NTU1ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')` }}
        />
        
        {/* Background hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-400/20"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 50,
                rotate: Math.random() * 360 
              }}
              animate={{ 
                y: -100,
                rotate: Math.random() * 360 + 360 
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity,
                delay: Math.random() * 3 
              }}
            >
              <Heart className="size-8" fill="currentColor" />
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full relative z-10"
        >
          {/* Back button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
          >
            <ArrowLeft className="size-5" />
            <span className="font-medium">Back</span>
          </motion.button>

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", duration: 0.8 }}
              className="mb-4"
            >
              <img 
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTFieGQ5YmFwYTJseXB4YTNtemhncGZqM2dxa3Z2ODRmbW52bzFpcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif" 
                alt="Celebration" 
                className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-2xl object-cover shadow-lg"
              />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">
              wla3 el donya!
            </h1>
            <p className="text-xl text-gray-700 mb-2">
              You've made me the happiest person!
            </p>
            <p className="text-lg text-gray-600">
              Now, pick your Valentine's gift hehehe:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {gifts.map((gift, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGiftClick(index)}
                className={`p-6 rounded-2xl border-4 transition-all ${
                  selectedGift === index
                    ? 'border-pink-500 bg-pink-50 shadow-lg'
                    : 'border-pink-200 bg-white hover:border-pink-300'
                }`}
              >
                {!revealedGifts[index] ? (
                  <>
                    <div className="text-6xl mb-3">🎁</div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Gift {index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">Click to reveal!</p>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.6 }}
                    >
                      <div className="text-6xl mb-3">{gift.icon}</div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">
                        {gift.name}
                      </h3>
                      <p className="text-sm text-gray-600">{gift.description}</p>
                    </motion.div>
                    {selectedGift === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-3"
                      >
                        <Gift className="size-6 text-pink-500 mx-auto" />
                      </motion.div>
                    )}
                  </>
                )}
              </motion.button>
            ))}
          </div>

          {selectedGift !== null && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-8 text-xl text-pink-600 font-semibold"
            >
              Perfect choice! Can't wait for our Valentine's Day! 💖
            </motion.p>
          )}
        </motion.div>

        {/* Audio element */}
        <audio ref={audioRef} loop>
          <source src="/v.mp3" type="audio/mp3" />
        </audio>
      </div>
    );
  }

  return (
    <div className="size-full min-h-screen bg-gradient-to-br from-rose-900 via-rose-800 to-amber-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541921647959-8a0850bde8c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcm9tYW50aWMlMjBjYW5kbGVsaWdodHxlbnwxfHx8fDE3NzA1NTU1ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')` }}
      />

      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-400/30"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 50 
            }}
            animate={{ 
              y: -100,
              x: Math.random() * window.innerWidth 
            }}
            transition={{ 
              duration: Math.random() * 8 + 7, 
              repeat: Infinity,
              delay: Math.random() * 5 
            }}
          >
            <Heart className="size-6" fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full relative z-10"
      >
        {/* Countdown Timer */}
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Valentine's Day Countdown 💝</p>
          <div className="flex justify-center gap-2 md:gap-4">
            <div className="bg-pink-100 rounded-lg p-2 md:p-3 min-w-[60px]">
              <div className="text-2xl md:text-3xl font-bold text-pink-600">{timeLeft.days}</div>
              <div className="text-xs text-gray-600">Days</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-2 md:p-3 min-w-[60px]">
              <div className="text-2xl md:text-3xl font-bold text-pink-600">{timeLeft.hours}</div>
              <div className="text-xs text-gray-600">Hours</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-2 md:p-3 min-w-[60px]">
              <div className="text-2xl md:text-3xl font-bold text-pink-600">{timeLeft.minutes}</div>
              <div className="text-xs text-gray-600">Minutes</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-2 md:p-3 min-w-[60px]">
              <div className="text-2xl md:text-3xl font-bold text-pink-600">{timeLeft.seconds}</div>
              <div className="text-xs text-gray-600">Seconds</div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="inline-block mb-6"
          >
            <Heart className="size-24 text-red-500 mx-auto" fill="currentColor" />
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-pink-600 mb-6 leading-tight">
            Will You Be My Valentine? 🙃​
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            I promise to make every moment special ​🤍
          </p>
        </div>

        <div className="flex gap-4 justify-center items-center flex-wrap">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYes}
            style={{
              transform: `scale(${yesButtonSize / 100})`,
            }}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-12 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            Yes! ​👌
          </motion.button>

          <motion.button
            ref={noButtonRef}
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoTouch}
            animate={{ 
              x: noButtonPosition.x, 
              y: noButtonPosition.y 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              transform: `scale(${noButtonSize / 100})`,
            }}
            className="bg-gray-300 text-gray-600 px-12 py-4 rounded-full font-bold text-xl shadow-lg cursor-pointer"
          >
            No
          </motion.button>
        </div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          Hint: There's only one right answer 😉
        </motion.p>
      </motion.div>

      {/* Audio element */}
      <audio ref={audioRef} loop>
        <source src="/v.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
}