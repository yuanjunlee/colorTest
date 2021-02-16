var gamma_mode = 1;

/* miscellaneous */
var clamp = function(val, min, max) {
    return(val < min ? min : (val > max ? max : val));
};

var toRGBString = function(rgb) {
    return("rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")");
};

/* color conversion */
var rgb2hsv = function(rgb) {
    var hsv = [0, 0, 0];
    var max_val = Math.max(rgb[0], rgb[1], rgb[2]);
    var min_val = Math.min(rgb[0], rgb[1], rgb[2]);

    if (max_val == min_val) {
        hsv[0] = 0;
    } else if (max_val == rgb[0]) {
        hsv[0] = 60 * (rgb[1] - rgb[2]) / (max_val - min_val);
        if (hsv[0] < 0) {
            hsv[0] += 360;
        }
    } else if (max_val == rgb[1]) {
        hsv[0] = 60 * (rgb[2] - rgb[0]) / (max_val - min_val) + 120;
    } else if (max_val == rgb[2]) {
        hsv[0] = 60 * (rgb[0] - rgb[1]) / (max_val - min_val) + 240;
    }

    hsv[1] = max_val == 0 ? 0 : 100 * (1 - min_val / max_val);
    hsv[2] = max_val / 255 * 100;

    hsv[0] = Math.round(hsv[0] * 10) / 10;
    hsv[1] = Math.round(hsv[1] * 10) / 10;
    hsv[2] = Math.round(hsv[2] * 10) / 10;

    return hsv;
};

var hsv2rgb = function(hsv) {
    var tmp = [hsv[0], hsv[1] / 100, hsv[2] / 100];
    var rgb = [0, 0, 0];

    var hue_class = Math.floor(tmp[0] / 60);
    var hue_rot;
    var max_val = tmp[2] * 255;
    var val_diff = max_val * tmp[1];
    var min_val = max_val - val_diff;
    var val_shift;

    if (tmp[1] == 0) {
        rgb = [max_val, max_val, max_val];
    } else {
        switch(hue_class) {
            case 5:
            case 6:
                hue_rot = 360 - tmp[0];
                val_shift = hue_rot / 60 * val_diff;
                rgb = [max_val, min_val, min_val + val_shift];
                break;
            case 0:
                hue_rot = tmp[0] - 0;
                val_shift = hue_rot / 60 * val_diff;
                rgb = [max_val, min_val + val_shift, min_val];
                break;
            case 1:
                hue_rot = 120 - tmp[0];
                val_shift = hue_rot / 60 * val_diff;
                rgb = [min_val + val_shift, max_val, min_val];
                break;
            case 2:
                hue_rot = tmp[0] - 120;
                val_shift = hue_rot / 60 * val_diff;
                rgb = [min_val, max_val, min_val + val_shift];
                break;
            case 3:
                hue_rot = 240 - tmp[0];
                val_shift = hue_rot / 60 * val_diff;
                rgb = [min_val, min_val + val_shift, max_val];
                break;
            case 4:
                hue_rot = tmp[0] - 240;
                val_shift = hue_rot / 60 * val_diff;
                rgb = [min_val + val_shift, min_val, max_val];
                break;
        }
    }

    for (var i = 0; i < 3; i++) {
        rgb[i] = clamp(Math.round(rgb[i]), 0, 255);
    }

    return rgb;
};

/* gamma related */
/* Linear -> sRGB is encode
 * sRGB -> Linear is decode
 */
var gamma_bt709 = function(encode, rgb) {
    var tmp = $.extend(true, {}, rgb);
    for (var i = 0; i < 3; i++) {
        tmp[i] /= 255;
    }

    if (encode) {
        for (var i = 0; i < 3; i++) {
            if (tmp[i] < 0.018) {
                tmp[i] = 4.5 * tmp[i];
            } else {
                tmp[i] = 1.099 * Math.pow(tmp[i], 0.45) - 0.099;
            }
        }
    } else {
        for (var i = 0; i < 3; i++) {
            if (tmp[i] < 0.081) {
                tmp[i] = tmp[i] / 4.5;
            } else {
                tmp[i] = Math.pow((tmp[i] + 0.099) / 1.099, 1 / 0.45);
            }
        }
    }

    for (var i = 0; i < 3; i++) {
        tmp[i] *= 255;
    }

    return tmp;
};

var gamma_22 = function(encode, rgb) {
    var tmp = $.extend(true, {}, rgb);
    for (var i = 0; i < 3; i++) {
        tmp[i] /= 255;
    }

    if (encode) {
        for (var i = 0; i < 3; i++) {
            tmp[i] = Math.pow(tmp[i], 1 / 2.2);
        }
    } else {
        for (var i = 0; i < 3; i++) {
            tmp[i] = Math.pow(tmp[i], 2.2);
        }
    }

    for (var i = 0; i < 3; i++) {
        tmp[i] *= 255;
    }

    return tmp;
};

var gammaEncode = function(rgb) {
    var tmp = $.extend(true, {}, rgb);
    switch(gamma_mode) {
        case 0:
            return tmp;
            break;
        case 1:
            return gamma_bt709(true, tmp);
            break;
        case 2:
            return gamma_22(true, tmp);
            break;
    }
};

var gammaDecode = function(rgb) {
    var tmp = $.extend(true, {}, rgb);
    switch(gamma_mode) {
        case 0:
            return tmp;
            break;
        case 1:
            return gamma_bt709(false, tmp);
            break;
        case 2:
            return gamma_22(false, tmp);
            break;
    }
};

var updateGamma = function() {
    gamma_mode = Number($("#gammaSelect").val());
};

/* calculate color */
var calcOutputColor = function(rgb) {
    var ccm = getCCM();
    var tmp = $.extend(true, {}, rgb);

    tmp = gammaDecode(tmp);

    tmp = matmul31(ccm, tmp);

    tmp = gammaEncode(tmp);

    for (var i = 0; i < 3; i++) {
        tmp[i] = clamp(Math.round(tmp[i]), 0, 255);
    }

    return tmp;
};

var calcInputColor = function(rgb) {
    // TBD
};