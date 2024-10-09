//import React, { StrictMode } from "https://esm.run/react@18";
//import { createRoot } from "https://esm.run/react-dom@18/client";

const AspectRatio = (props) => {
  const { ratio = 1 / 1, ...otherProps } = props;

  return (
    <div
      className="aspect-ratio"
      style={{ paddingTop: `${100 / ratio}%` }}
      {...otherProps}
    />
  );
};

const Gradient = (props) => {
  const { angle = 0, from, to } = props;

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${from}, ${to})`
      }}
    />
  );
};

const Palette = (props) => {
  const { from, to } = props;

  return (
    <figure className="palette">
      <figcaption className="palette__caption">
        {from} – {to}
      </figcaption>
      <AspectRatio>
        <Gradient angle={135} {...props} />
      </AspectRatio>
    </figure>
  );
};

const Palettes = (props) => {
  const { palettes } = props;

  return (
    <div className="palettes">
      {palettes.map((palette) => (
        <Palette key={palette.toString()} {...palette} />
      ))}
    </div>
  );
};

const Grid = (props) => {
  return <div className="grid" {...props} />;
};

const App = () => {
  const palettes = [
    {
      from: "#f40076",
      to: "#df98fa"
    },
    {
      from: "#f06966",
      to: "#fad6a6"
    },
    {
      from: "#ff0076",
      to: "#590fb7"
    },
    {
      from: "#9055ff",
      to: "#13e2da"
    },
    {
      from: "#0b63f6",
      to: "#003cc5"
    },
    {
      from: "#d6ff7f",
      to: "#00b3cc"
    },
    {
      from: "#e233ff",
      to: "#ff6b00"
    },
    {
      from: "#df98fa",
      to: "#9055ff"
    },
    {
      from: "#ed7b84",
      to: "#9055ff"
    },
    {
      from: "#402565",
      to: "#30be96"
    },
    {
      from: "#402662",
      to: "#3900a6"
    },
    {
      from: "#f14658",
      to: "#dc2537"
    },
    {
      from: "#f40076",
      to: "#342711"
    },
    {
      from: "#000066",
      to: "#6699ff"
    },
    {
      from: "#cb5eee",
      to: "#4be1ec"
    },
    {
      from: "#fa7cbb",
      to: "#f14658"
    },
    {
      from: "#737dfe",
      to: "#ffcac9"
    },
    {
      from: "#2f80ed",
      to: "#b2ffda"
    }
  ];

  return (
    <div className="app">
      <Grid>
        <Palettes palettes={palettes} />
      </Grid>
    </div>
  );
};

export default function() {
    return (

        linear-gradient(135deg, blue, red)
    )
}