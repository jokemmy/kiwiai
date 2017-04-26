
import { urlLoader, fileLoader } from './getLoaders';

export default function getFontRules({
  fileName
}) {

  const woffFontLoader = {
    test: /\.woff$/i,
    use: [urlLoader({
      name: fileName,
      mimetype: 'application/font-woff'
    })]
  };

  const woff2FontLoader = {
    test: /\.woff2$/i,
    use: [urlLoader({
      name: fileName,
      mimetype: 'application/font-woff2'
    })]
  };

  const ttfFontLoader = {
    test: /\.ttf$/i,
    use: [urlLoader({
      name: fileName,
      mimetype: 'application/octet-stream'
    })]
  };

  const eotFontLoader = {
    test: /\.eot$/i,
    use: [fileLoader({
      name: fileName
    })]
  };

  return {
    woffFontLoader,
    woff2FontLoader,
    ttfFontLoader,
    eotFontLoader
  };
}
