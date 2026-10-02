declare module 'tailwindcss/lib/util/flattenColorPalette' {
  const flattenColorPalette: (
    colors: Record<string, any>
  ) => Record<string, string>;
  export default flattenColorPalette;
}

declare module 'mini-svg-data-uri' {
  const svgToDataUri: (svg: string) => string;
  export default svgToDataUri;
}
