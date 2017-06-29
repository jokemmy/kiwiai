
import { urlLoader } from './getLoaders';

export default function getSVGLoaders({
  fileName,
  svgSpriteDirs
}) {

  const baseSvgLoader = {
    test: /\.svg$/i,
    use: [urlLoader({
      name: fileName,
      mimetype: 'image/svg+xml'
    })]
  };

  const spriteSvgLoader = {
    test: /\.(svg)$/i,
    use: ['svg-sprite-loader']
  };

  if ( svgSpriteDirs ) {
    baseSvgLoader.exclude = svgSpriteDirs;
    spriteSvgLoader.include = svgSpriteDirs;
    return {
      baseSvgLoader,
      spriteSvgLoader
    };
  }

  return { baseSvgLoader };
}

