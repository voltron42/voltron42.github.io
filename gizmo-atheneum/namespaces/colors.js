namespace('gizmo-atheneum.namespaces.Colors',{},() => {
    const colorMap = {
        aquamarine: '#7FFFD4',
        lime: '#00FF00',
        deepskyblue: '#00BFFF',
        darksalmon: '#E9967A',
        antiquewhite: '#FAEBD7',
        mediumturquoise: '#48D1CC',
        slategrey: '#708090',
        slategray: '#708090',
        sienna: '#A0522D',
        orange: '#FFA500',
        navajowhite: '#FFDEAD',
        lavenderblush: '#FFF0F5',
        firebrick: '#B22222',
        orangered: '#FF4500',
        palevioletred: '#DB7093',
        lawngreen: '#7CFC00',
        seashell: '#FFF5EE',
        lightpink: '#FFB6C1',
        darkolivegreen: '#556B2F',
        aliceblue: '#F0F8FF',
        gray: '#808080',
        lightsteelblue: '#B0C4DE',
        whitesmoke: '#F5F5F5',
        darkgoldenrod: '#B8860B',
        tan: '#D2B48C',
        bisque: '#FFE4C4',
        white: '#FFFFFF',
        lightgreen: '#90EE90',
        darkseagreen: '#8FBC8F',
        crimson: '#DC143C',
        darkslategray: '#2F4F4F',
        mistyrose: '#FFE4E1',
        chocolate: '#D2691E',
        yellow: '#FFFF00',
        cadetblue: '#5F9EA0',
        navy: '#000080',
        ghostwhite: '#F8F8FF',
        dimgrey: '#696969',
        rebeccapurple: '#663399',
        seagreen: '#2E8B57',
        green: '#008000',
        mediumseagreen: '#3CB371',
        indigo: '#4B0082',
        olivedrab: '#6B8E23',
        cyan: '#00FFFF',
        peachpuff: '#FFDAB9',
        limegreen: '#32CD32',
        mediumslateblue: '#7B68EE',
        violet: '#EE82EE',
        sandybrown: '#F4A460',
        yellowgreen: '#9ACD32',
        mediumspringgreen: '#00FA9A',
        steelblue: '#4682B4',
        rosybrown: '#BC8F8F',
        cornflowerblue: '#6495ED',
        ivory: '#FFFFF0',
        lightgoldenrodyellow: '#FAFAD2',
        salmon: '#FA8072',
        darkcyan: '#008B8B',
        peru: '#CD853F',
        cornsilk: '#FFF8DC',
        lightslategray: '#778899',
        blueviolet: '#8A2BE2',
        forestgreen: '#228B22',
        lightseagreen: '#20B2AA',
        gold: '#FFD700',
        gainsboro: '#DCDCDC',
        darkorchid: '#9932CC',
        burlywood: '#DEB887',
        lightskyblue: '#87CEFA',
        chartreuse: '#7FFF00',
        snow: '#FFFAFA',
        moccasin: '#FFE4B5',
        honeydew: '#F0FFF0',
        aqua: '#00FFFF',
        darkred: '#8B0000',
        mediumorchid: '#BA55D3',
        lightsalmon: '#FFA07A',
        saddlebrown: '#8B4513',
        wheat: '#F5DEB3',
        springgreen: '#00FF7F',
        lightslategrey: '#778899',
        darkblue: '#00008B',
        powderblue: '#B0E0E6',
        turquoise: '#40E0D0',
        blanchedalmond: '#FFEBCD',
        papayawhip: '#FFEFD5',
        slateblue: '#6A5ACD',
        lightblue: '#ADD8E6',
        skyblue: '#87CEEB',
        red: '#FF0000',
        lightyellow: '#FFFFE0',
        blue: '#0000FF',
        palegreen: '#98FB98',
        greenyellow: '#ADFF2F',
        khaki: '#F0E68C',
        maroon: '#800000',
        darkgrey: '#A9A9A9',
        midnightblue: '#191970',
        floralwhite: '#FFFAF0',
        deeppink: '#FF1493',
        paleturquoise: '#AFEEEE',
        darkkhaki: '#BDB76B',
        azure: '#F0FFFF',
        indianred: '#CD5C5C',
        darkviolet: '#9400D3',
        mediumpurple: '#9370DB',
        fuchsia: '#FF00FF',
        coral: '#FF7F50',
        mediumvioletred: '#C71585',
        lemonchiffon: '#FFFACD',
        mediumblue: '#0000CD',
        darkmagenta: '#8B008B',
        goldenrod: '#DAA520',
        darkorange: '#FF8C00',
        orchid: '#DA70D6',
        plum: '#DDA0DD',
        pink: '#FFC0CB',
        teal: '#008080',
        magenta: '#FF00FF',
        lightgrey: '#D3D3D3',
        purple: '#800080',
        dodgerblue: '#1E90FF',
        darkturquoise: '#00CED1',
        mintcream: '#F5FFFA',
        hotpink: '#FF69B4',
        thistle: '#D8BFD8',
        royalblue: '#4169E1',
        darkgreen: '#006400',
        darkslateblue: '#483D8B',
        silver: '#C0C0C0',
        darkgray: '#A9A9A9',
        grey: '#808080',
        oldlace: '#FDF5E6',
        mediumaquamarine: '#66CDAA',
        brown: '#A52A2A',
        lightgray: '#D3D3D3',
        olive: '#808000',
        lightcoral: '#F08080',
        tomato: '#FF6347',
        lightcyan: '#E0FFFF',
        linen: '#FAF0E6',
        darkslategrey: '#2F4F4F',
        lavender: '#E6E6FA',
        dimgray: '#696969',
        palegoldenrod: '#EEE8AA',
        beige: '#F5F5DC',
        black: '#000000',
    };
    const nameLookup = Object.entries(colorMap).reduce((out,[name, color]) => {
        out[color] = name;
        return out;
    }, {});
    const getColorNames = function() {
        return Object.keys(colorMap).sort();
    }
    const getColorByName = function(name) {
        return colorMap[name];
    }
    const getNameForColor = function(color) {
        return nameLookup[color];
    }
    const getAllNamedColors = function() {
        return Object.values(colorMap);
    }
    const rgbFromHex = function (hex) {
        if (typeof hex === 'string' && hex.length > 0) {
          if (!hexPattern.test(hex)) {
            hex = Colors.getColorByName(hex);
          }
          if (typeof hex === 'string' && hex.length > 0) {
            const [red, green, blue] = [1, 3, 5].map((i) =>
              parseInt(hex.substr(i, 2), 16)
            );
            return { red, green, blue };
          }
        }
    };
    const getForegroundColor = function (hex,defaultColor) {
        const rgb = rgbFromHex(hex);
        if (!rgb) {
          return defaultColor;
        }
        const luminosity = Math.sqrt(
          Math.pow(rgb['red'], 2) * 0.299 +
            Math.pow(rgb['green'], 2) * 0.587 +
            Math.pow(rgb['blue'], 2) * 0.114
        );
        return luminosity > 186 ? 'black' : 'white';
    };
    const hexFromRGB = function (r, g, b) {
        return (
          '#' +
          [r, g, b]
            .map((c) => {
              let h = Number(c).toString(16);
              if (h.length === 1) {
                h = '0' + h;
              }
              return h;
            })
            .join('')
        );
    };
    return { 
        getColorNames, getColorByName, getNameForColor, getAllNamedColors,
        rgbFromHex, getForegroundColor, hexFromRGB
    };
});