import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../util/PageWrapper";
import Diamond from "../Images/Diamond.jpg";
import Sapphire from "../Images/Saphire.jpg";
import Ruby from "../Images/Ruby.jpg";
import Emerald from "../Images/Emarald.avif";
import Amethyst from "../Images/Amethyst.jpg";
import Topaz from "../Images/Topaz.jpg";

export default function About() {
  const navigate = useNavigate();

  const stones = [
    {
      id: 1,
      name: "Topaz",
      title: "What is Topaz? Topaz Healing Properties",
      category: ["GEMSTONES", "NATURAL GEMSTONES"],
      image: Topaz,
      excerpt: "TOPAZ GEMSTONE Topaz makes an ideal gem. A good hardness and desirable colors, combined with a relative abundance and availability make it one of the most popular gemstones.",
      fullDescription: "Topaz is a precious gemstone known for its stunning clarity and vibrant colors. It's one of the hardest naturally occurring minerals, making it perfect for jewelry. Topaz is believed to bring joy, generosity, abundance, and good health. It's known as a stone of love and good fortune.",
    },
    {
      id: 2,
      name: "Sapphire",
      title: "The Sapphire Gemstone (Neelam Stone)",
      category: ["GEMSTONES", "NATURAL GEMSTONES"],
      image: Sapphire,
      excerpt: "Sapphire (Neelam) is the most precious and valuable blue gemstone. It is a very desirable gemstone due to its excellent color, hardness, durability, and luster.",
      fullDescription: "Sapphire is one of the four precious gemstones, alongside diamond, ruby, and emerald. Known for its deep blue color, sapphire represents wisdom, virtue, and good fortune. In Vedic astrology, Neelam (Blue Sapphire) is considered one of the most powerful gemstones.",
    },
    {
      id: 3,
      name: "Emerald",
      title: "Emerald Gemstone: Properties & Benefits",
      category: ["GEMSTONES", "PRECIOUS STONES"],
      image: Emerald,
      excerpt: "Emerald is a precious gemstone known for its vibrant green color. It symbolizes rebirth, love, and is believed to grant the owner foresight and good fortune.",
      fullDescription: "Emerald, the green variety of beryl, has been treasured for thousands of years. Known as the 'Stone of Successful Love', emerald is said to bring loyalty and enhance unconditional love. It's also believed to promote friendship, balance, and harmony.",
    },
    {
      id: 4,
      name: "Ruby",
      title: "Ruby: The King of Precious Stones",
      category: ["GEMSTONES", "PRECIOUS STONES"],
      image: Ruby,
      excerpt: "Ruby is one of the most historically significant colored stones. It's the red variety of corundum and represents passion, protection, and prosperity.",
      fullDescription: "Ruby has been called the 'King of Gems' for centuries. Its deep red color symbolizes passion, courage, and emotion. In ancient times, warriors believed wearing ruby would make them invincible in battle. It's associated with vitality and strength.",
    },
    {
      id: 5,
      name: "Amethyst",
      title: "Amethyst: The Stone of Tranquility",
      category: ["GEMSTONES", "HEALING STONES"],
      image: Amethyst,
      excerpt: "Amethyst is a purple variety of quartz that has been highly esteemed throughout the ages for its stunning beauty and legendary powers to stimulate and soothe the mind.",
      fullDescription: "Amethyst is a meditative and calming stone that works in the emotional, spiritual, and physical planes. It's known as a natural tranquilizer, relieving stress and strain. Amethyst is also believed to enhance higher states of consciousness and meditation.",
    },
    {
      id: 6,
      name: "Diamond",
      title: "Diamond: The Ultimate Symbol of Love",
      category: ["GEMSTONES", "PRECIOUS STONES"],
      image: Diamond,
      excerpt: "Diamond is the hardest natural substance known to man and has been a symbol of eternal love, strength, and invincibility for centuries.",
      fullDescription: "Diamond is the ultimate gemstone, possessing the highest hardness and thermal conductivity. Known as the 'King of Crystals', diamonds symbolize eternal love, strength, and clarity. They're believed to amplify energy and bring balance to the wearer.",
    }
  ];

  return (
    <PageWrapper>
    <div className="min-h-screenpy-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center my-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Discover Popular Gemstones
          </h1>
          <p className="text-gray-400 text-sm md:text-md max-w-2xl mx-auto">
            Explore the world's most beloved gemstones, their properties, and healing benefits
          </p>
        </div>

        {/* Stones Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {stones.map((stone, index) => (
            <div
              key={stone.id}
              className={` rounded-lg overflow-hidden shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } flex flex-col lg:flex`}
            >
              {/* Image Section */}
              <div className="lg:w-1/2 relative overflow-hidden group">
                <img
                  src={stone.image}
                  alt={stone.name}
                  className="w-full h-64 lg:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  {stone.category.map((cat, idx) => (
                    <span
                      key={idx}
                      className="bg-amber-500 text-gray-900 px-3 py-1 text-xs font-semibold rounded"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {stone.title}
                  </h2>

                  <div className="flex items-center gap-3 mb-4 text-gray-600 text-sm">
                    <span className="flex items-center gap-1">
                      <i className="bi bi-person-circle"></i>
                      Posted by Royal Stones
                    </span>
                  </div>

                  <p className="text-gray-500 mb-4 leading-relaxed">
                     {stone.excerpt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center rounded-lg p-8 border border-amber-500/30">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            Looking for Your Perfect Gemstone?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore our collection of authentic, certified gemstones and find the one that resonates with you
          </p>
          <button className="bg-amber-500 hover:bg-amber-600 py-3 px-8 rounded-lg transition-colors duration-200 cursor-pointer"
          onClick={()=>{navigate('/shop')}}>
            Browse Collection
          </button>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}