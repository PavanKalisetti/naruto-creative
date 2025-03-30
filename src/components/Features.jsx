import { useState, useRef, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

// New carousel component
export const DeviceCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const deviceScreens = [
    { 
      image: "/img/n1.jpeg",
      alt: "Naruto image 1"
    },
    { 
      image: "/img/n2.jpeg",
      alt: "Naruto image 2"
    },
    { 
      image: "/img/n3.jpeg", 
      alt: "Naruto image 3"
    },
    { 
      image: "/img/n4.jpeg",
      alt: "Naruto image 4"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % deviceScreens.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [deviceScreens.length]);

  return (
    <div className="absolute size-full">
      <div className="perspective-1000 relative w-full h-full flex items-center justify-center">
        <div className="relative h-[520px]" style={{ width: '80%', maxWidth: '800px' }}>
          {deviceScreens.map((screen, index) => {
            const position = (index - activeIndex + deviceScreens.length) % deviceScreens.length;
            const zIndex = deviceScreens.length - position;
            
            // Calculate positions for center alignment
            const basePositionX = '50%'; // Center point
            const spacing = 120;
            let offsetX;
            
            if (position === 0) {
              offsetX = 0;
            } else if (position === 1) {
              offsetX = -spacing;
            } else if (position === 2) {
              offsetX = -spacing * 2;
            } else {
              offsetX = -spacing * 3;
            }
            
            return (
              <div
                key={index}
                className="absolute phone-mockup transition-all duration-1000 ease-in-out overflow-hidden"
                style={{
                  zIndex,
                  left: basePositionX,
                  top: '50%',
                  opacity: position === 0 ? 1 : position === 1 ? 0.85 : position === 2 ? 0.7 : 0.55,
                  transform: `translate(calc(-50% + ${offsetX}px), -50%) rotateY(-5deg) scale(${1 - position * 0.08})`,
                  width: '260px',
                  height: '520px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 2px rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Phone notch */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10"></div>
                
                {/* Screen content */}
                <img 
                  src={screen.image}
                  alt={screen.alt}
                  className="absolute top-0 left-0 size-full object-cover"
                />
                
                {/* Screen overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Gradient overlay */}
      <div className="absolute left-0 top-0 size-full bg-gradient-to-r from-black/90 via-black/50 to-black/10 z-[5]" />
    </div>
  );
};

export const BentoCard = ({ src, title, description, isComingSoon, useCarousel = false }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full">
      {useCarousel ? (
        <DeviceCarousel />
      ) : (
        <video
          src={src}
          loop
          muted
          autoPlay
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
      )}
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            {/* Radial gradient hover effect */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            {/* <p className="relative z-20">coming soon</p> */}
          </div>
        )}
      </div>
    </div>
  );
};

const Features = () => (
  <section className="bg-black pb-52">
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <p className="font-circular-web text-lg text-blue-50">
        Step Into the Shinobi World
        </p>
        <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
        Immerse yourself in the vast and ever-expanding ninja realm, where legendary techniques, fierce rivalries, and unbreakable bonds shape the path of every warrior.
        </p>
      </div>

      <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard
          useCarousel={true}
          title={
            <>
              Shi<b>n</b>obi Path
            </>
          }
          description="A cross-realm ninja journey—turn your battles, training, and missions into a legendary adventure across the shinobi world."
          isComingSoon
        />
      </BentoTilt>

      <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
          <BentoCard
            src="videos/naruto-stock-1.mp4"
            title={
              <>
                Ryu<b>j</b>in Shinobi
              </>
            }
            description=""
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
          <BentoCard
            src="videos/naruto-stock-2.mp4"
            title={
              <>
                P<b>e</b>ace
              </>
            }
            description="A tribute to the legends of Konoha—where every ninja’s journey is etched in history."
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
          <BentoCard
            src="videos/naruto-stock-3.mp4"
            title={
              <>
                Will<b> O</b>f Fire
              </>
            }
            description="Enter a world of jutsu, rivalries, and unbreakable bonds—your ninja story begins here."
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              T<b>h</b>e jo<b>u</b>rney c<b>o</b>ntinues...
            </h1>

            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <video
            src="videos/naruto-stock-4.mp4"
            loop
            muted
            autoPlay
            className="size-full object-cover object-center"
          />
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
