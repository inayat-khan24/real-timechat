import React, { useState } from "react";

const themes = [
  {
    name: "Default",
    value: "default",
    img: null,
  },
  {
    name: "Dark",
    value: "dark",
    img: null,
  },
  {
    name: "Gradient",
    value: "gradient",
    img: null,
  },
  {
    name: "BgStock",
    value: "BgStock",
    img: "https://static.vecteezy.com/system/resources/thumbnails/035/719/133/small_2x/ai-generated-abstract-golden-wave-on-black-background-vector-illustration-for-your-design-abstract-golden-lines-on-black-bg-ai-generated-free-photo.jpg",
  },
  {
    name: "Love",
    value: "love",
    img: "https://www.shutterstock.com/image-photo/valentines-day-love-theme-background-260nw-573985108.jpg",
  },
    {
    name: "emoji",
    value: "emoji",
    img: "https://i.pinimg.com/236x/2c/89/b6/2c89b6c8c03f0d953fcf01ce0f15672a.jpg",
  },
];

const ThemeSelector = ({ theme, setTheme }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white border px-4 py-2 rounded-md shadow text-sm flex items-center gap-2"
      >
        Select Theme
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-48 bg-white border rounded shadow">
          {themes.map((item) => (
            <div
              key={item.value}
              onClick={() => {
                setTheme(item.value);
                setOpen(false);
              }}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.img && (
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-6 h-6 object-cover rounded-full mr-2"
                />
              )}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
