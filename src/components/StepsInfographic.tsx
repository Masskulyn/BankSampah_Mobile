import React, { useEffect } from "react";
import { UserPlus, Trash2, Gift, Wallet } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay@8.6.0";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function StepsInfographic() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  
  const steps: Step[] = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Registrasi",
      description: "Daftar akun dengan mudah dan cepat, gratis!",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: <Trash2 className="w-8 h-8" />,
      title: "Setor Sampah",
      description: "Scan QR dan setor sampah di lokasi terdekat",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Tukar Poin",
      description: "Kumpulkan poin dari setiap setoran sampah",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Tarik Uang",
      description: "Cairkan saldo ke rekening atau e-wallet",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
          Cara Kerja Bank Sampah Digital
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          4 langkah mudah untuk mulai menghasilkan dari sampah Anda
        </p>
      </div>

      <div className="relative px-2 md:px-16">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {steps.map((step, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                    {/* Icon */}
                    <div className={`${step.bgColor} ${step.color} w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-lg mx-auto`}>
                      {React.cloneElement(step.icon as React.ReactElement, { 
                        className: "w-6 h-6 md:w-8 md:h-8" 
                      })}
                    </div>

                    {/* Step number */}
                    <div className="flex justify-center mb-2 md:mb-3">
                      <div className="bg-gradient-to-br from-gray-800 to-gray-600 text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-gray-900 mb-1 md:mb-2 text-sm md:text-base text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed text-center">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="hidden md:flex -left-12 bg-white hover:bg-gray-50 border-2 border-gray-200 shadow-lg" />
          <CarouselNext className="hidden md:flex -right-12 bg-white hover:bg-gray-50 border-2 border-gray-200 shadow-lg" />
        </Carousel>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index 
                  ? "w-8 bg-green-600" 
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-6 md:mt-8 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm">
          <span>✨ Proses cepat, aman, dan transparan</span>
        </div>
      </div>
    </div>
  );
}
