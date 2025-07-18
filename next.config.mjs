/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Encuentra la regla para archivos CSS
    const cssRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString().includes('css')
    );

    // Si la regla existe, modifícala para excluir los archivos de primeicons
    if (cssRule && cssRule.oneOf) {
      cssRule.oneOf.forEach((oneOf) => {
        if (oneOf.use && Array.isArray(oneOf.use)) {
          const postcssLoader = oneOf.use.find(
            (loader) => loader.loader && loader.loader.includes('postcss-loader')
          );
          if (postcssLoader) {
            if (!oneOf.exclude) {
              oneOf.exclude = [];
            } else if (!Array.isArray(oneOf.exclude)) {
              oneOf.exclude = [oneOf.exclude];
            }
            oneOf.exclude.push(/primeicons\.css$/);
          }
        }
      });
    }

    return config;
  },
};

export default nextConfig;