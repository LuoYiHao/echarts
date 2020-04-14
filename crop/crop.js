(function() {
    var debug = false;

    var root = this;

    var EXIF = function(obj) {
        if (obj instanceof EXIF) return obj;
        if (!(this instanceof EXIF)) return new EXIF(obj);
        this.EXIFwrapped = obj;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = EXIF;
        }
        exports.EXIF = EXIF;
    } else {
        root.EXIF = EXIF;
    }

    var ExifTags = EXIF.Tags = {

        // version tags
        0x9000 : "ExifVersion",             // EXIF version
        0xA000 : "FlashpixVersion",         // Flashpix format version

        // colorspace tags
        0xA001 : "ColorSpace",              // Color space information tag

        // image configuration
        0xA002 : "PixelXDimension",         // Valid width of meaningful image
        0xA003 : "PixelYDimension",         // Valid height of meaningful image
        0x9101 : "ComponentsConfiguration", // Information about channels
        0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

        // user information
        0x927C : "MakerNote",               // Any desired information written by the manufacturer
        0x9286 : "UserComment",             // Comments by user

        // related file
        0xA004 : "RelatedSoundFile",        // Name of related sound file

        // date and time
        0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
        0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
        0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
        0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
        0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A : "ExposureTime",            // Exposure time (in seconds)
        0x829D : "FNumber",                 // F number
        0x8822 : "ExposureProgram",         // Exposure program
        0x8824 : "SpectralSensitivity",     // Spectral sensitivity
        0x8827 : "ISOSpeedRatings",         // ISO speed rating
        0x8828 : "OECF",                    // Optoelectric conversion factor
        0x9201 : "ShutterSpeedValue",       // Shutter speed
        0x9202 : "ApertureValue",           // Lens aperture
        0x9203 : "BrightnessValue",         // Value of brightness
        0x9204 : "ExposureBias",            // Exposure bias
        0x9205 : "MaxApertureValue",        // Smallest F number of lens
        0x9206 : "SubjectDistance",         // Distance to subject in meters
        0x9207 : "MeteringMode",            // Metering mode
        0x9208 : "LightSource",             // Kind of light source
        0x9209 : "Flash",                   // Flash status
        0x9214 : "SubjectArea",             // Location and area of main subject
        0x920A : "FocalLength",             // Focal length of the lens in mm
        0xA20B : "FlashEnergy",             // Strobe energy in BCPS
        0xA20C : "SpatialFrequencyResponse",    //
        0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214 : "SubjectLocation",         // Location of subject in image
        0xA215 : "ExposureIndex",           // Exposure index selected on camera
        0xA217 : "SensingMethod",           // Image sensor type
        0xA300 : "FileSource",              // Image source (3 == DSC)
        0xA301 : "SceneType",               // Scene type (1 == directly photographed)
        0xA302 : "CFAPattern",              // Color filter array geometric pattern
        0xA401 : "CustomRendered",          // Special processing
        0xA402 : "ExposureMode",            // Exposure mode
        0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
        0xA404 : "DigitalZoomRation",       // Digital zoom ratio
        0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406 : "SceneCaptureType",        // Type of scene
        0xA407 : "GainControl",             // Degree of overall image gain adjustment
        0xA408 : "Contrast",                // Direction of contrast processing applied by camera
        0xA409 : "Saturation",              // Direction of saturation processing applied by camera
        0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
        0xA40B : "DeviceSettingDescription",    //
        0xA40C : "SubjectDistanceRange",    // Distance to subject

        // other tags
        0xA005 : "InteroperabilityIFDPointer",
        0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
    };

    var TiffTags = EXIF.TiffTags = {
        0x0100 : "ImageWidth",
        0x0101 : "ImageHeight",
        0x8769 : "ExifIFDPointer",
        0x8825 : "GPSInfoIFDPointer",
        0xA005 : "InteroperabilityIFDPointer",
        0x0102 : "BitsPerSample",
        0x0103 : "Compression",
        0x0106 : "PhotometricInterpretation",
        0x0112 : "Orientation",
        0x0115 : "SamplesPerPixel",
        0x011C : "PlanarConfiguration",
        0x0212 : "YCbCrSubSampling",
        0x0213 : "YCbCrPositioning",
        0x011A : "XResolution",
        0x011B : "YResolution",
        0x0128 : "ResolutionUnit",
        0x0111 : "StripOffsets",
        0x0116 : "RowsPerStrip",
        0x0117 : "StripByteCounts",
        0x0201 : "JPEGInterchangeFormat",
        0x0202 : "JPEGInterchangeFormatLength",
        0x012D : "TransferFunction",
        0x013E : "WhitePoint",
        0x013F : "PrimaryChromaticities",
        0x0211 : "YCbCrCoefficients",
        0x0214 : "ReferenceBlackWhite",
        0x0132 : "DateTime",
        0x010E : "ImageDescription",
        0x010F : "Make",
        0x0110 : "Model",
        0x0131 : "Software",
        0x013B : "Artist",
        0x8298 : "Copyright"
    };

    var GPSTags = EXIF.GPSTags = {
        0x0000 : "GPSVersionID",
        0x0001 : "GPSLatitudeRef",
        0x0002 : "GPSLatitude",
        0x0003 : "GPSLongitudeRef",
        0x0004 : "GPSLongitude",
        0x0005 : "GPSAltitudeRef",
        0x0006 : "GPSAltitude",
        0x0007 : "GPSTimeStamp",
        0x0008 : "GPSSatellites",
        0x0009 : "GPSStatus",
        0x000A : "GPSMeasureMode",
        0x000B : "GPSDOP",
        0x000C : "GPSSpeedRef",
        0x000D : "GPSSpeed",
        0x000E : "GPSTrackRef",
        0x000F : "GPSTrack",
        0x0010 : "GPSImgDirectionRef",
        0x0011 : "GPSImgDirection",
        0x0012 : "GPSMapDatum",
        0x0013 : "GPSDestLatitudeRef",
        0x0014 : "GPSDestLatitude",
        0x0015 : "GPSDestLongitudeRef",
        0x0016 : "GPSDestLongitude",
        0x0017 : "GPSDestBearingRef",
        0x0018 : "GPSDestBearing",
        0x0019 : "GPSDestDistanceRef",
        0x001A : "GPSDestDistance",
        0x001B : "GPSProcessingMethod",
        0x001C : "GPSAreaInformation",
        0x001D : "GPSDateStamp",
        0x001E : "GPSDifferential"
    };

     // EXIF 2.3 Spec
    var IFD1Tags = EXIF.IFD1Tags = {
        0x0100: "ImageWidth",
        0x0101: "ImageHeight",
        0x0102: "BitsPerSample",
        0x0103: "Compression",
        0x0106: "PhotometricInterpretation",
        0x0111: "StripOffsets",
        0x0112: "Orientation",
        0x0115: "SamplesPerPixel",
        0x0116: "RowsPerStrip",
        0x0117: "StripByteCounts",
        0x011A: "XResolution",
        0x011B: "YResolution",
        0x011C: "PlanarConfiguration",
        0x0128: "ResolutionUnit",
        0x0201: "JpegIFOffset",    // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
        0x0202: "JpegIFByteCount", // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
        0x0211: "YCbCrCoefficients",
        0x0212: "YCbCrSubSampling",
        0x0213: "YCbCrPositioning",
        0x0214: "ReferenceBlackWhite"
    };

    var StringValues = EXIF.StringValues = {
        ExposureProgram : {
            0 : "Not defined",
            1 : "Manual",
            2 : "Normal program",
            3 : "Aperture priority",
            4 : "Shutter priority",
            5 : "Creative program",
            6 : "Action program",
            7 : "Portrait mode",
            8 : "Landscape mode"
        },
        MeteringMode : {
            0 : "Unknown",
            1 : "Average",
            2 : "CenterWeightedAverage",
            3 : "Spot",
            4 : "MultiSpot",
            5 : "Pattern",
            6 : "Partial",
            255 : "Other"
        },
        LightSource : {
            0 : "Unknown",
            1 : "Daylight",
            2 : "Fluorescent",
            3 : "Tungsten (incandescent light)",
            4 : "Flash",
            9 : "Fine weather",
            10 : "Cloudy weather",
            11 : "Shade",
            12 : "Daylight fluorescent (D 5700 - 7100K)",
            13 : "Day white fluorescent (N 4600 - 5400K)",
            14 : "Cool white fluorescent (W 3900 - 4500K)",
            15 : "White fluorescent (WW 3200 - 3700K)",
            17 : "Standard light A",
            18 : "Standard light B",
            19 : "Standard light C",
            20 : "D55",
            21 : "D65",
            22 : "D75",
            23 : "D50",
            24 : "ISO studio tungsten",
            255 : "Other"
        },
        Flash : {
            0x0000 : "Flash did not fire",
            0x0001 : "Flash fired",
            0x0005 : "Strobe return light not detected",
            0x0007 : "Strobe return light detected",
            0x0009 : "Flash fired, compulsory flash mode",
            0x000D : "Flash fired, compulsory flash mode, return light not detected",
            0x000F : "Flash fired, compulsory flash mode, return light detected",
            0x0010 : "Flash did not fire, compulsory flash mode",
            0x0018 : "Flash did not fire, auto mode",
            0x0019 : "Flash fired, auto mode",
            0x001D : "Flash fired, auto mode, return light not detected",
            0x001F : "Flash fired, auto mode, return light detected",
            0x0020 : "No flash function",
            0x0041 : "Flash fired, red-eye reduction mode",
            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod : {
            1 : "Not defined",
            2 : "One-chip color area sensor",
            3 : "Two-chip color area sensor",
            4 : "Three-chip color area sensor",
            5 : "Color sequential area sensor",
            7 : "Trilinear sensor",
            8 : "Color sequential linear sensor"
        },
        SceneCaptureType : {
            0 : "Standard",
            1 : "Landscape",
            2 : "Portrait",
            3 : "Night scene"
        },
        SceneType : {
            1 : "Directly photographed"
        },
        CustomRendered : {
            0 : "Normal process",
            1 : "Custom process"
        },
        WhiteBalance : {
            0 : "Auto white balance",
            1 : "Manual white balance"
        },
        GainControl : {
            0 : "None",
            1 : "Low gain up",
            2 : "High gain up",
            3 : "Low gain down",
            4 : "High gain down"
        },
        Contrast : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        Saturation : {
            0 : "Normal",
            1 : "Low saturation",
            2 : "High saturation"
        },
        Sharpness : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        SubjectDistanceRange : {
            0 : "Unknown",
            1 : "Macro",
            2 : "Close view",
            3 : "Distant view"
        },
        FileSource : {
            3 : "DSC"
        },

        Components : {
            0 : "",
            1 : "Y",
            2 : "Cb",
            3 : "Cr",
            4 : "R",
            5 : "G",
            6 : "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }


    function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    function objectURLToBlob(url, callback) {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "blob";
        http.onload = function(e) {
            if (this.status == 200 || this.status === 0) {
                callback(this.response);
            }
        };
        http.send();
    }

    function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
            var data = findEXIFinJPEG(binFile);
            img.exifdata = data || {};
            var iptcdata = findIPTCinJPEG(binFile);
            img.iptcdata = iptcdata || {};
            if (EXIF.isXmpEnabled) {
               var xmpdata= findXMPinJPEG(binFile);
               img.xmpdata = xmpdata || {};               
            }
            if (callback) {
                callback.call(img);
            }
        }

        if (img.src) {
            if (/^data\:/i.test(img.src)) { // Data URI
                var arrayBuffer = base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);

            } else if (/^blob\:/i.test(img.src)) { // Object URL
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    handleBinaryFile(e.target.result);
                };
                objectURLToBlob(img.src, function (blob) {
                    fileReader.readAsArrayBuffer(blob);
                });
            } else {
                var http = new XMLHttpRequest();
                http.onload = function() {
                    if (this.status == 200 || this.status === 0) {
                        handleBinaryFile(http.response);
                    } else {
                        throw "Could not load image";
                    }
                    http = null;
                };
                http.open("GET", img.src, true);
                http.responseType = "arraybuffer";
                http.send(null);
            }
        } else if (self.FileReader && (img instanceof self.Blob || img instanceof self.File)) {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                if (debug) console.log("Got file of length " + e.target.result.byteLength);
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);
        }
    }

    function findEXIFinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
            if (debug) console.log(marker);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 225) {
                if (debug) console.log("Found 0xFFE1 marker");

                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else {
                offset += 2 + dataView.getUint16(offset+2);
            }

        }

    }

    function findIPTCinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength;


        var isFieldSegmentStart = function(dataView, offset){
            return (
                dataView.getUint8(offset) === 0x38 &&
                dataView.getUint8(offset+1) === 0x42 &&
                dataView.getUint8(offset+2) === 0x49 &&
                dataView.getUint8(offset+3) === 0x4D &&
                dataView.getUint8(offset+4) === 0x04 &&
                dataView.getUint8(offset+5) === 0x04
            );
        };

        while (offset < length) {

            if ( isFieldSegmentStart(dataView, offset )){

                // Get the length of the name header (which is padded to an even number of bytes)
                var nameHeaderLength = dataView.getUint8(offset+7);
                if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
                // Check for pre photoshop 6 format
                if(nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }

                var startOffset = offset + 8 + nameHeaderLength;
                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

                return readIPTCData(file, startOffset, sectionLength);

                break;

            }


            // Not the marker, continue searching
            offset++;

        }

    }
    var IptcFieldMap = {
        0x78 : 'caption',
        0x6E : 'credit',
        0x19 : 'keywords',
        0x37 : 'dateCreated',
        0x50 : 'byline',
        0x55 : 'bylineTitle',
        0x7A : 'captionWriter',
        0x69 : 'headline',
        0x74 : 'copyright',
        0x0F : 'category'
    };
    function readIPTCData(file, startOffset, sectionLength){
        var dataView = new DataView(file);
        var data = {};
        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
        var segmentStartPos = startOffset;
        while(segmentStartPos < startOffset+sectionLength) {
            if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
                segmentType = dataView.getUint8(segmentStartPos+2);
                if(segmentType in IptcFieldMap) {
                    dataSize = dataView.getInt16(segmentStartPos+3);
                    segmentSize = dataSize + 5;
                    fieldName = IptcFieldMap[segmentType];
                    fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
                    // Check if we already stored a value with this name
                    if(data.hasOwnProperty(fieldName)) {
                        // Value already stored with this name, create multivalue field
                        if(data[fieldName] instanceof Array) {
                            data[fieldName].push(fieldValue);
                        }
                        else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    }
                    else {
                        data[fieldName] = fieldValue;
                    }
                }

            }
            segmentStartPos++;
        }
        return data;
    }



    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset, tag,
            i;

        for (i=0;i<entries;i++) {
            entryOffset = dirStart + i*12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }


    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset+2, !bigEnd),
            numValues = file.getUint32(entryOffset+4, !bigEnd),
            valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
            offset,
            vals, val, n,
            numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return getStringFromDB(file, offset, numValues-1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint16(offset + 2*n, !bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 5:    // rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset+4, !bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
                        denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
                    }
                    return vals;
                }
        }
    }

    /**
    * Given an IFD (Image File Directory) start offset
    * returns an offset to next IFD or 0 if it's the last IFD.
    */
    function getNextIFDOffset(dataView, dirStart, bigEnd){
        //the first 2bytes means the number of directory entries contains in this IFD
        var entries = dataView.getUint16(dirStart, !bigEnd);

        // After last directory entry, there is a 4bytes of data,
        // it means an offset to next IFD.
        // If its value is '0x00000000', it means this is the last IFD and there is no linked IFD.

        return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd); // each entry is 12 bytes long
    }

    function readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd){
        // get the IFD1 offset
        var IFD1OffsetPointer = getNextIFDOffset(dataView, tiffStart+firstIFDOffset, bigEnd);

        if (!IFD1OffsetPointer) {
            // console.log('******** IFD1Offset is empty, image thumb not found ********');
            return {};
        }
        else if (IFD1OffsetPointer > dataView.byteLength) { // this should not happen
            // console.log('******** IFD1Offset is outside the bounds of the DataView ********');
            return {};
        }
        // console.log('*******  thumbnail IFD offset (IFD1) is: %s', IFD1OffsetPointer);

        var thumbTags = readTags(dataView, tiffStart, tiffStart + IFD1OffsetPointer, IFD1Tags, bigEnd)

        // EXIF 2.3 specification for JPEG format thumbnail

        // If the value of Compression(0x0103) Tag in IFD1 is '6', thumbnail image format is JPEG.
        // Most of Exif image uses JPEG format for thumbnail. In that case, you can get offset of thumbnail
        // by JpegIFOffset(0x0201) Tag in IFD1, size of thumbnail by JpegIFByteCount(0x0202) Tag.
        // Data format is ordinary JPEG format, starts from 0xFFD8 and ends by 0xFFD9. It seems that
        // JPEG format and 160x120pixels of size are recommended thumbnail format for Exif2.1 or later.

        if (thumbTags['Compression']) {
            // console.log('Thumbnail image found!');

            switch (thumbTags['Compression']) {
                case 6:
                    // console.log('Thumbnail image format is JPEG');
                    if (thumbTags.JpegIFOffset && thumbTags.JpegIFByteCount) {
                    // extract the thumbnail
                        var tOffset = tiffStart + thumbTags.JpegIFOffset;
                        var tLength = thumbTags.JpegIFByteCount;
                        thumbTags['blob'] = new Blob([new Uint8Array(dataView.buffer, tOffset, tLength)], {
                            type: 'image/jpeg'
                        });
                    }
                break;

            case 1:
                console.log("Thumbnail image format is TIFF, which is not implemented.");
                break;
            default:
                console.log("Unknown thumbnail image format '%s'", thumbTags['Compression']);
            }
        }
        else if (thumbTags['PhotometricInterpretation'] == 2) {
            console.log("Thumbnail image format is RGB, which is not implemented.");
        }
        return thumbTags;
    }

    function getStringFromDB(buffer, start, length) {
        var outstr = "";
        for (n = start; n < start+length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }

    function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
            return false;
        }

        var bigEnd,
            tags, tag,
            exifData, gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

        if (firstIFDOffset < 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        exifData[tag] =
                            StringValues.Components[exifData[tag][0]] +
                            StringValues.Components[exifData[tag][1]] +
                            StringValues.Components[exifData[tag][2]] +
                            StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID" :
                        gpsData[tag] = gpsData[tag][0] +
                            "." + gpsData[tag][1] +
                            "." + gpsData[tag][2] +
                            "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        // extract thumbnail
        tags['thumbnail'] = readThumbnailImage(file, tiffOffset, firstIFDOffset, bigEnd);

        return tags;
    }

   function findXMPinJPEG(file) {

        if (!('DOMParser' in self)) {
            // console.warn('XML parsing not supported without DOMParser');
            return;
        }
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
           if (debug) console.log("Not a valid JPEG");
           return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            dom = new DOMParser();

        while (offset < (length-4)) {
            if (getStringFromDB(dataView, offset, 4) == "http") {
                var startOffset = offset - 1;
                var sectionLength = dataView.getUint16(offset - 2) - 1;
                var xmpString = getStringFromDB(dataView, startOffset, sectionLength)
                var xmpEndIndex = xmpString.indexOf('xmpmeta>') + 8;
                xmpString = xmpString.substring( xmpString.indexOf( '<x:xmpmeta' ), xmpEndIndex );

                var indexOfXmp = xmpString.indexOf('x:xmpmeta') + 10
                //Many custom written programs embed xmp/xml without any namespace. Following are some of them.
                //Without these namespaces, XML is thought to be invalid by parsers
                xmpString = xmpString.slice(0, indexOfXmp)
                            + 'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" '
                            + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
                            + 'xmlns:tiff="http://ns.adobe.com/tiff/1.0/" '
                            + 'xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" '
                            + 'xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" '
                            + 'xmlns:exif="http://ns.adobe.com/exif/1.0/" '
                            + 'xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" '
                            + 'xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" '
                            + 'xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" '
                            + 'xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" '
                            + 'xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" '
                            + xmpString.slice(indexOfXmp)

                var domDocument = dom.parseFromString( xmpString, 'text/xml' );
                return xml2Object(domDocument);
            } else{
             offset++;
            }
        }
    }

    function xml2json(xml) {
        var json = {};
      
        if (xml.nodeType == 1) { // element node
          if (xml.attributes.length > 0) {
            json['@attributes'] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
              var attribute = xml.attributes.item(j);
              json['@attributes'][attribute.nodeName] = attribute.nodeValue;
            }
          }
        } else if (xml.nodeType == 3) { // text node
          return xml.nodeValue;
        }
      
        // deal with children
        if (xml.hasChildNodes()) {
          for(var i = 0; i < xml.childNodes.length; i++) {
            var child = xml.childNodes.item(i);
            var nodeName = child.nodeName;
            if (json[nodeName] == null) {
              json[nodeName] = xml2json(child);
            } else {
              if (json[nodeName].push == null) {
                var old = json[nodeName];
                json[nodeName] = [];
                json[nodeName].push(old);
              }
              json[nodeName].push(xml2json(child));
            }
          }
        }
        
        return json;
    }

    function xml2Object(xml) {
        try {
            var obj = {};
            if (xml.children.length > 0) {
              for (var i = 0; i < xml.children.length; i++) {
                var item = xml.children.item(i);
                var attributes = item.attributes;
                for(var idx in attributes) {
                    var itemAtt = attributes[idx];
                    var dataKey = itemAtt.nodeName;
                    var dataValue = itemAtt.nodeValue;

                    if(dataKey !== undefined) {
                        obj[dataKey] = dataValue;
                    }
                }
                var nodeName = item.nodeName;

                if (typeof (obj[nodeName]) == "undefined") {
                  obj[nodeName] = xml2json(item);
                } else {
                  if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];

                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                  }
                  obj[nodeName].push(xml2json(item));
                }
              }
            } else {
              obj = xml.textContent;
            }
            return obj;
          } catch (e) {
              console.log(e.message);
          }
    }

    EXIF.enableXmp = function() {
        EXIF.isXmpEnabled = true;
    }

    EXIF.disableXmp = function() {
        EXIF.isXmpEnabled = false;
    }

    EXIF.getData = function(img, callback) {
        if (((self.Image && img instanceof self.Image)
            || (self.HTMLImageElement && img instanceof self.HTMLImageElement))
            && !img.complete)
            return false;

        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    EXIF.getTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.exifdata[tag];
    }
    
    EXIF.getIptcTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.iptcdata[tag];
    }

    EXIF.getAllTags = function(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.exifdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }
    
    EXIF.getAllIptcTags = function(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.iptcdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }

    EXIF.pretty = function(img) {
        if (!imageHasData(img)) return "";
        var a,
            data = img.exifdata,
            strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                } else {
                    strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    }

    EXIF.readFromBinaryFile = function(file) {
        return findEXIFinJPEG(file);
    }

    if (typeof define === 'function' && define.amd) {
        define('exif-js', [], function() {
            return EXIF;
        });
    }
}.call(this));


/**
 * input输入框快速选择image
 */
(function() {
    'use strict';

    /**
     * 全局生效默认设置
     * 默认设置可以最大程度的减小调用时的代码
     */
    var defaultSetting = {
        // 可选参数  File Image Camera Image_Camera Image_File Camera_File Text All
        type: 'ALL',
        isMulti: false,
        container: ''
    };

    function extend(target) {
        var finalTarget = target;

        for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            rest[_key - 1] = arguments[_key];
        }

        rest.forEach(function(source) {
            source && Object.keys(source).forEach(function(key) {
                finalTarget[key] = source[key];
            });
        });

        return finalTarget;
    }

    function selector(element) {
        var target = element;

        if (typeof target === 'string') {
            target = document.querySelector(target);
        }

        return target;
    }

    /**
     * 从一个file对象,加载对应的数据
     * FileReader的方法
     * 方法名              参数              描述
     * readAsBinaryString   file            将文件读取为二进制编码
     * readAsText           file,[encoding] 将文件读取为文本
     * readAsDataURL        file            将文件读取为DataURL
     * abort                (none)          终端读取操作
     * @param {FileReader} oFReader 对应的加载器
     * @param {File} file 文件对象,选择的是img类型
     * @param {Function} success 成功加载完毕后的回调,回调result(不同的加载方式result类型不同)
     * @param {Function} error 失败回调
     * @return {FileReader} 返回文件加载器对象
     * @param {String} type 类型,DataUrl还是Text还是Binary
     */
    function loadDataFromFile(oFReader, file, success, error, type) {
        if (window.FileReader || !oFReader || !(oFReader instanceof FileReader)) {
            oFReader.onload = function(oFREvent) {
                // 解决DataUrl模式下的b64字符串不正确问题
                var b64 = oFREvent.target.result;

                if (type === 'DataUrl') {
                    // 正常的图片应该是data:image/gif;data:image/png;;data:image/jpeg;data:image/x-icon;
                    // 而在Android的一些5.0系统以下(如4.0)的设备中,有些返回的b64字符串缺少关键image/gif标识,所以需要手动加上
                    if (b64 && b64.indexOf('data:base64,') !== -1) {
                        // 去除旧有的错误头部
                        b64 = b64.replace('data:base64,', '');
                        var dataType = '';
                        // 文件名字
                        var name = file.name;

                        if (name && name.toLowerCase().indexOf('.jpg') !== -1) {
                            // jpeg
                            dataType = 'image/jpeg';
                        } else if (name && name.toLowerCase().indexOf('.png') !== -1) {
                            // png
                            dataType = 'image/png';
                        } else if (name && name.toLowerCase().indexOf('.gif') !== -1) {
                            // gif
                            dataType = 'image/gif';
                        } else if (name && name.toLowerCase().indexOf('.icon') !== -1) {
                            // x-icon
                            dataType = 'image/x-icon';
                        }
                        b64 = 'data:' + dataType + ';base64,' + b64;
                    }
                }
                success && success(b64);
            };
            oFReader.onerror = function(error) {
                error && error(error);
            };
            if (type === 'DataUrl') {
                oFReader.readAsDataURL(file);
            } else if (type === 'Text') {
                oFReader.readAsText(file);
            } else {
                oFReader.readAsBinaryString(file);
            }

            return oFReader;
        } else {
            error && error('错误:FileReader不存在!');
        }
    }

    /**
     * 构造一个 FileInpput 对象
     * @param {Object} options 配置参数
     * @constructor
     */
    function FileInput(options) {

        options = extend({}, defaultSetting, options);

        this.container = selector(options.container);
        this.options = options;

        this._init();
        this._addEvent();

    }

    FileInput.prototype = {

        /**
         * 初始化 type isMulti filter等
         */
        _init: function() {
            var options = this.options,
                container = this.container,
                isEjs = /EpointEJS/.test(navigator.userAgent);;

            // 设置单个文件选择需要的 属性
            container.setAttribute('type', 'file');

            if (options.isMulti) {
                container.setAttribute('multiple', 'multiple');
            } else {
                container.removeAttribute('multiple');
            }

            var accept = options.accept || container.getAttribute('accept');
            var type = options.type || 'File';
            var filter;

            if (type === 'Image') {
                filter = 'image/*';
                type = 'DataUrl';
            } else if (type === 'Camera') {
                if (isEjs) {
                    filter = 'camera/*';
                } else {
                    filter = 'image/*';
                }
                type = 'DataUrl';
            } else if (type === 'Image_Camera') {
                if (isEjs) {
                    filter = 'image_camera/*';
                } else {
                    filter = 'image/*';
                }
                type = 'DataUrl';
            } else if (type === 'Image_File') {
                if (isEjs) {
                    filter = 'image_file/*';
                } else {
                    filter = '*';
                }
                type = 'DataUrl';
            } else if (type === 'Camera_File') {
                if (isEjs) {
                    filter = 'camera_file/*';
                } else {
                    filter = '*';
                }
                type = 'DataUrl';
            } else if (type === 'Text') {
                filter = 'file/*';
                type = 'Text';

            } else if (type === 'File') {
               if (isEjs) {
                    filter = 'file/*';
                    type = 'File';
                } else {
                    filter = '*';
                    type = 'File';
                }
            } else if (type === 'All') {
                if (isEjs) {
                    filter = '*/*';
                    type = 'DataUrl';
                } else {
                    filter = '*';
                    type = 'DataUrl';
                }
            } else {
                filter = '*';
                type = 'File';
            }
            this.dataType = type;
            filter = accept || filter;
            container.setAttribute('accept', filter);
        },

        /**
         * 增加事件，包括
         * 轮播图片的监听
         * 图片滑动的监听，等等
         */
        _addEvent: function() {
            var container = this.container,
                options = this.options,
                success = options.success,
                error = options.error,
                self = this;

            // 选择的回调中进行预处理
            var changeHandle = function() {
                var aFiles = container.files;
                var len = aFiles.length;

                if (len === 0) {
                    return;
                }
                // 定义文件读取器和后缀类型过滤器
                var oFReader = new window.FileReader();
                var index = 0;

                var chainCall = function() {
                    if (index >= len) {
                        return;
                    }
                    loadDataFromFile(oFReader, aFiles[index], function(b64Src) {
                        success && success(b64Src, aFiles[index], {
                            index: index,
                            len: len,
                            isEnd: (index >= len - 1)
                        });
                        index++;
                        chainCall();
                    }, error, self.dataType);
                };

                chainCall();
            };

            container.addEventListener('change', changeHandle);

            // 注册一个委托对象，方便取消
            this.delegatesHandle = changeHandle;
        },

        /**
         * 将需要暴露的destroy绑定到了 原型链上
         */
        destroy: function() {

            this.container.removeEventListener('change', this.delegatesHandle);

            this.container = null;
            this.options = null;
        }
    };

    window.FileInput = FileInput;
})();
/*!
 * image-process v0.0.1
 * (c) 2017-2017 dailc
 * Released under the MIT License.
 * https://github.com/dailc/image-process
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ImageClip = factory());
}(this, (function () { 'use strict';

function extend(target) {
    var finalTarget = target;

    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
    }

    rest.forEach(function (source) {
        source && Object.keys(source).forEach(function (key) {
            finalTarget[key] = source[key];
        });
    });

    return finalTarget;
}

/**
 * 选择这段代码用到的太多了，因此抽取封装出来
 * @param {Object} element dom元素或者selector
 * @return {HTMLElement} 返回选择的Dom对象，无果没有符合要求的，则返回null
 */
function selector(element) {
    var target = element;

    if (typeof target === 'string') {
        target = document.querySelector(target);
    }

    return target;
}

/**
 * 获取DOM的可视区高度，兼容PC上的body高度获取
 * 因为在通过body获取时，在PC上会有CSS1Compat形式，所以需要兼容
 * @param {HTMLElement} dom 需要获取可视区高度的dom,对body对象有特殊的兼容方案
 * @return {Number} 返回最终的高度
 */


/**
 * 设置一个Util对象下的命名空间
 * @param {Object} parent 需要绑定到哪一个对象上
 * @param {String} namespace 需要绑定的命名空间名
 * @param {Object} target 需要绑定的目标对象
 * @return {Object} 返回最终的对象
 */

/**
 * 加入系统判断功能
 */
function osMixin(hybrid) {
    var hybridJs = hybrid;
    var detect = function detect(ua) {
        this.os = {};

        var android = ua.match(/(Android);?[\s/]+([\d.]+)?/);

        if (android) {
            this.os.android = true;
            this.os.version = android[2];
            this.os.isBadAndroid = !/Chrome\/\d/.test(window.navigator.appVersion);
        }

        var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);

        if (iphone) {
            this.os.ios = true;
            this.os.iphone = true;
            this.os.version = iphone[2].replace(/_/g, '.');
        }

        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);

        if (ipad) {
            this.os.ios = true;
            this.os.ipad = true;
            this.os.version = ipad[2].replace(/_/g, '.');
        }

        // quickhybrid的容器
        var quick = ua.match(/QuickHybrid/i);

        if (quick) {
            this.os.quick = true;
        }

        // epoint的容器
        var ejs = ua.match(/EpointEJS/i);

        if (ejs) {
            this.os.ejs = true;
        }

        var dd = ua.match(/DingTalk/i);

        if (dd) {
            this.os.dd = true;
        }

        // 如果ejs和钉钉以及quick都不是，则默认为h5
        if (!ejs && !dd && !quick) {
            this.os.h5 = true;
        }
    };

    detect.call(hybridJs, navigator.userAgent);
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ios手机竖拍时会旋转，需要外部引入exif去主动旋转
 */

var defaultetting = {
    container: '#imgclip',
    // 必须是一个image对象
    img: null,
    // 是否开启平滑
    isSmooth: true,
    // 放大镜捕获的图像半径
    captureRadius: 30,
    // 移动矩形框时的最小间距
    minMoveDiff: 1,
    // 压缩质量
    quality: 0.92,
    mime: 'image/jpeg',
    // 限制canvas显示的最大高度（不是实际高度，是css显示的最大高度）
    // 单位是像素，不传的话不限制
    maxCssHeight: 0,
    // 大小提示框的风格，0-点击时显示，1-恒显示，-1-永不显示
    sizeTipsStyle: 0,
    // 压缩时的放大系数，默认为1，如果增大，代表图像的尺寸会变大(最大不会超过原图)
    compressScaleRatio: 1,
    // ios的iPhone下主动放大一定系数以解决分辨率过小的模糊问题
    iphoneFixedRatio: 2,
    // 是否采用原图像素（不会压缩）
    isUseOriginSize: false,
    // 增加最大宽度，增加后最大不会超过这个宽度
    maxWidth: 0,
    // 使用强制的宽度，如果使用，其它宽高比系数都会失效，默认整图使用这个宽度
    forceWidth: 0,
    // 同上，但是一般不建议设置，因为很可能会改变宽高比导致拉升，特殊场景下使用
    forceHeight: 0
};

var ImgClip$1 = function () {
    /**
     * 构造函数
     * @param {Object} options 配置信息
     * @constructor
     */
    function ImgClip(options) {
        _classCallCheck(this, ImgClip);

        osMixin(this);
        this.options = extend({}, defaultetting, options);
        this.container = selector(this.options.container);
        this.img = this.options.img;
        this.domChildren = [];
        this.events = {};

        this.initCanvas();
        this.initClip();
        this.initMagnifier();
        this.initTransferCanvas();
        this.resetClipRect();
    }

    /**
     * 获取devicePixelRatio(像素比)
     * canvas绘制时乘以缩放系数，防止裁剪不清晰
     * （譬如320的手机上可能裁剪出来的就是640-系数是2）
     */


    _createClass(ImgClip, [{
        key: 'getPixelRatio',
        value: function getPixelRatio(context) {
            // 注意，backingStorePixelRatio属性已弃用
            var backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;

            var ratio = (window.devicePixelRatio || 1) / backingStore;

            ratio *= this.options.compressScaleRatio || 1;
            if (this.os.ios && this.os.iphone) {
                ratio *= this.options.iphoneFixedRatio || 1;
            }

            return ratio;
        }
    }, {
        key: 'clear',
        value: function clear() {
            var lenD = this.domChildren && this.domChildren.length || 0;

            for (var i = 0; i < lenD; i += 1) {
                this.container.removeChild(this.domChildren[i]);
            }
            this.domChildren = null;

            var allEventNames = Object.keys(this.events || {});
            var lenE = allEventNames && allEventNames.length || 0;

            for (var _i = 0; _i < lenE; _i += 1) {
                this.container.removeEventListener(allEventNames[_i], this.events[allEventNames[_i]]);
            }
            this.events = null;
        }
    }, {
        key: 'initCanvas',
        value: function initCanvas() {
            this.canvasFull = document.createElement('canvas');
            this.ctxFull = this.canvasFull.getContext('2d');
            this.canvasFull.className = 'clip-canvas-full';
            this.smoothCtx(this.ctxFull);

            // 实际的像素比，绘制时基于这个比例绘制
            this.RATIO_PIXEL = this.getPixelRatio(this.ctxFull);
            // 获取图片的宽高比
            var wPerH = this.img.width / this.img.height;
            var oldWidth = this.container.offsetWidth || window.innerWidth;

            this.oldWidth = oldWidth;
            this.oldHeight = oldWidth / wPerH;
            this.resizeCanvas(oldWidth, this.oldHeight);
            this.container.appendChild(this.canvasFull);
            this.domChildren.push(this.canvasFull);
        }
    }, {
        key: 'resizeCanvas',
        value: function resizeCanvas(width, height) {
            var maxCssHeight = this.options.maxCssHeight;
            var wPerH = width / height;
            var legalWidth = this.oldWidth;
            var legalHeight = legalWidth / wPerH;

            if (maxCssHeight && legalHeight > maxCssHeight) {
                legalHeight = maxCssHeight;
                legalWidth = legalHeight * wPerH;
            }
            this.marginLeft = (this.oldWidth - legalWidth) / 2;

            this.canvasFull.style.width = legalWidth + 'px';
            this.canvasFull.style.height = legalHeight + 'px';
            this.canvasFull.style.marginLeft = this.marginLeft + 'px';
            this.canvasFull.width = legalWidth * this.RATIO_PIXEL;
            this.canvasFull.height = legalHeight * this.RATIO_PIXEL;

            if (this.rotateStep & 1) {
                this.scale = this.canvasFull.width / this.img.height;
            } else {
                this.scale = this.canvasFull.width / this.img.width;
            }
        }
    }, {
        key: 'initClip',
        value: function initClip() {
            var clipRect = document.createElement('div');

            clipRect.className = 'clip-rect';

            this.clipRect = clipRect;
            this.container.appendChild(this.clipRect);
            this.domChildren.push(this.clipRect);

            // 添加tips
            var clipTips = document.createElement('span');

            clipTips.className = 'clip-tips';
            this.clipRect.appendChild(clipTips);
            this.clipTips = clipTips;

            if (this.options.sizeTipsStyle === -1 || this.options.sizeTipsStyle === 0) {
                // clipTips,canvas之外的
                this.clipTips.classList.add('clip-hidden');
            }

            this.clipRectHorns = [];
            // 添加8个角
            for (var i = 0; i < 8; i += 1) {
                var spanHorn = document.createElement('span');

                spanHorn.className = 'clip-rect-horn ';

                if (i === 0) {
                    spanHorn.className += 'horn-nw';
                } else if (i === 1) {
                    spanHorn.className += 'horn-ne';
                } else if (i === 2) {
                    spanHorn.className += 'horn-sw';
                } else if (i === 3) {
                    spanHorn.className += 'horn-se';
                } else if (i === 4) {
                    spanHorn.className += 'horn-n';
                } else if (i === 5) {
                    spanHorn.className += 'horn-s';
                } else if (i === 6) {
                    spanHorn.className += 'horn-w';
                } else if (i === 7) {
                    spanHorn.className += 'horn-e';
                }
                this.clipRect.appendChild(spanHorn);
                this.clipRectHorns.push(spanHorn);
            }

            this.resizeClip();
        }
    }, {
        key: 'resizeClip',
        value: function resizeClip() {
            this.listenerHornsResize();
            this.listenerRectMove();
            this.listenerContainerLeave();
        }
    }, {
        key: 'listenerHornsResize',
        value: function listenerHornsResize() {
            var _this = this;

            this.clipEventState = {};

            var saveEventState = function saveEventState(e) {
                _this.clipEventState.width = _this.clipRect.offsetWidth;
                _this.clipEventState.height = _this.clipRect.offsetHeight;
                _this.clipEventState.left = _this.clipRect.offsetLeft - _this.marginLeft;
                _this.clipEventState.top = _this.clipRect.offsetTop;
                _this.clipEventState.mouseX = e.touches ? e.touches[0].pageX : e.pageX;
                _this.clipEventState.mouseY = e.touches ? e.touches[0].pageY : e.pageY;
                _this.clipEventState.evnt = e;
            };
            var getCurXY = function getCurXY(mouseX, mouseY) {
                // 父容器的top和left也要减去
                var curY = mouseY - _this.canvasFull.offsetTop - _this.container.offsetTop;
                var curX = mouseX - _this.canvasFull.offsetLeft - _this.container.offsetLeft;

                curY = Math.min(curY, _this.canvasFull.offsetHeight);
                curY = Math.max(0, curY);
                curX = Math.min(curX, _this.canvasFull.offsetWidth);
                curX = Math.max(0, curX);

                _this.curX = curX;
                _this.curY = curY;

                return {
                    curX: curX,
                    curY: curY
                };
            };
            this.getCurXY = getCurXY;

            var moving = function moving(e) {
                if (!_this.canResizing) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                var clipEventState = _this.clipEventState;
                var target = clipEventState.evnt.target;
                // 区分pageX与clientX
                var mouseY = e.touches ? e.touches[0].pageY : e.pageY;
                var mouseX = e.touches ? e.touches[0].pageX : e.pageX;
                var curCooidinate = getCurXY(mouseX, mouseY);
                var curX = curCooidinate.curX;
                var curY = curCooidinate.curY;
                var width = void 0;
                var height = void 0;
                var left = void 0;
                var top = void 0;

                if (target.classList.contains('horn-nw')) {
                    width = clipEventState.width - (curX - clipEventState.left);
                    height = clipEventState.height - (curY - clipEventState.top);
                    left = curX;
                    top = curY;
                } else if (target.classList.contains('horn-ne')) {
                    width = curX - clipEventState.left;
                    height = clipEventState.height - (curY - clipEventState.top);
                    left = clipEventState.left;
                    top = curY;
                } else if (target.classList.contains('horn-sw')) {
                    width = clipEventState.width - (curX - clipEventState.left);
                    height = curY - clipEventState.top;
                    left = curX;
                    top = clipEventState.top;
                } else if (target.classList.contains('horn-se')) {
                    width = curX - clipEventState.left;
                    height = curY - clipEventState.top;
                    left = clipEventState.left;
                    top = clipEventState.top;
                } else if (target.classList.contains('horn-n')) {
                    width = clipEventState.width;
                    height = clipEventState.height - (curY - clipEventState.top);
                    left = clipEventState.left;
                    top = curY;
                } else if (target.classList.contains('horn-s')) {
                    width = clipEventState.width;
                    height = curY - clipEventState.top;
                    left = clipEventState.left;
                    top = clipEventState.top;
                } else if (target.classList.contains('horn-w')) {
                    width = clipEventState.width - (curX - clipEventState.left);
                    height = clipEventState.height;
                    left = curX;
                    top = clipEventState.top;
                } else if (target.classList.contains('horn-e')) {
                    width = curX - clipEventState.left;
                    height = clipEventState.height;
                    left = curX - width;
                    top = clipEventState.top;
                }
                // 一定要补上leftmargin
                _this.clipRect.style.left = left + _this.marginLeft + 'px';
                _this.clipRect.style.top = top + 'px';
                _this.clipRect.style.width = width + 'px';
                _this.clipRect.style.height = width / getScale() +'px';
                _this.draw();
            };

            this.container.addEventListener('touchmove', moving);
            this.container.addEventListener('mousemove', moving);

            this.events.touchmove = moving;
            this.events.mousemove = moving;

            var startResize = function startResize(e) {
                _this.canResizing = true;
                _this.canvasMag.classList.remove('clip-hidden');
                if (_this.options.sizeTipsStyle === 0) {
                    _this.clipTips.classList.remove('clip-hidden');
                }
                saveEventState(e);
            };
            var endResize = function endResize() {
                _this.canResizing = false;
                _this.canvasMag.classList.add('clip-hidden');
                if (_this.options.sizeTipsStyle === 0) {
                    _this.clipTips.classList.add('clip-hidden');
                }
            };

            this.endHronsResize = endResize;

            for (var i = 0; i < 8; i += 1) {
                this.clipRectHorns[i].addEventListener('mousedown', startResize);
                this.clipRectHorns[i].addEventListener('touchstart', startResize);

                this.clipRectHorns[i].addEventListener('mouseup', endResize);
                this.clipRectHorns[i].addEventListener('touchend', endResize);
            }
        }
    }, {
        key: 'listenerRectMove',
        value: function listenerRectMove() {
            var _this2 = this;

            var rectDom = this.clipRect;

            var moving = function moving(e) {
                if (_this2.canResizing || !_this2.canMove) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                var MIN_DIFF = _this2.options.minMoveDiff;
                var mouseY = e.touches ? e.touches[0].pageY : e.pageY;
                var mouseX = e.touches ? e.touches[0].pageX : e.pageX;

                var diffX = mouseX - _this2.prevRectMouseX;
                var diffY = mouseY - _this2.prevRectMouseY;

                if (!diffX && !diffY) {
                    return;
                }

                if (Math.abs(diffX) > MIN_DIFF || Math.abs(diffY) > MIN_DIFF) {
                    _this2.prevRectMouseX = mouseX;
                    _this2.prevRectMouseY = mouseY;
                }

                var top = rectDom.offsetTop + diffY;
                var left = rectDom.offsetLeft + diffX;

                if (top < 0) {
                    top = 0;
                } else if (top > _this2.canvasFull.offsetHeight - rectDom.offsetHeight) {
                    top = _this2.canvasFull.offsetHeight - rectDom.offsetHeight;
                }

                if (left < _this2.marginLeft) {
                    left = _this2.marginLeft;
                } else if (left > _this2.canvasFull.offsetWidth - rectDom.offsetWidth + _this2.marginLeft) {
                    left = _this2.canvasFull.offsetWidth - rectDom.offsetWidth + _this2.marginLeft;
                }

                // 这里无须再补上marginLeft
                _this2.clipRect.style.left = left + 'px';
                _this2.clipRect.style.top = top + 'px';
                _this2.draw();
            };

            rectDom.addEventListener('touchmove', moving);
            rectDom.addEventListener('mousemove', moving);

            var startMove = function startMove(e) {
                _this2.canMove = true;

                var mouseY = e.touches ? e.touches[0].pageY : e.pageY;
                var mouseX = e.touches ? e.touches[0].pageX : e.pageX;

                _this2.prevRectMouseX = mouseX;
                _this2.prevRectMouseY = mouseY;
            };

            var endMove = function endMove() {
                _this2.canMove = false;
            };

            this.endRectMove = endMove;

            rectDom.addEventListener('mousedown', startMove);
            rectDom.addEventListener('touchstart', startMove);

            rectDom.addEventListener('mouseup', endMove);
            rectDom.addEventListener('touchend', endMove);
        }
    }, {
        key: 'listenerContainerLeave',
        value: function listenerContainerLeave() {
            var _this3 = this;

            var leaveContainer = function leaveContainer() {
                if (_this3.canResizing) {
                    _this3.endHronsResize();
                }
                if (_this3.canMove) {
                    _this3.endRectMove();
                }
            };

            this.container.addEventListener('mouseleave', leaveContainer);
            this.container.addEventListener('mouseup', leaveContainer);
            this.events.mouseleave = leaveContainer;
            this.events.mouseup = leaveContainer;
        }
    }, {
        key: 'draw',
        value: function draw() {
            // 放大镜
            this.drawMag();
            var realImgSize = this.getRealFinalImgSize(this.clipRect.offsetWidth * this.RATIO_PIXEL, this.clipRect.offsetHeight * this.RATIO_PIXEL);
            var curWidth = realImgSize.width;
            var curHeight = realImgSize.height;

            this.clipTips.innerText = curWidth.toFixed(0) + '*' + curHeight.toFixed(0);

            this.ctxFull.save();
            if (this.rotateStep & 1) {
                this.ctxFull.clearRect(0, 0, this.canvasFull.height, this.canvasFull.width);
            } else {
                this.ctxFull.clearRect(0, 0, this.canvasFull.width, this.canvasFull.height);
            }

            this.drawImage();
            this.drawMask();

            this.ctxFull.beginPath();

            var params = this.getClipRectParams();
            var srcX = params.srcX;
            var srcY = params.srcY;
            var sWidth = params.sWidth;
            var sHeight = params.sHeight;

            this.ctxFull.rect(srcX, srcY, sWidth, sHeight);
            this.ctxFull.clip();
            this.drawImage();
            this.ctxFull.restore();
        }
    }, {
        key: 'getClipRectParams',
        value: function getClipRectParams() {
            var offsetTop = this.clipRect.offsetTop;
            // 减去margin才是真实的
            var offsetLeft = this.clipRect.offsetLeft - this.marginLeft;
            var offsetWidth = this.clipRect.offsetWidth;
            var offsetHeight = this.clipRect.offsetHeight;
            var offsetRight = offsetLeft + offsetWidth;
            var offsetBottom = offsetTop + offsetHeight;

            var srcX = offsetLeft;
            var srcY = offsetTop;
            var sWidth = offsetWidth;
            var sHeight = offsetHeight;

            if (this.rotateStep === 1) {
                srcX = offsetTop;
                srcY = this.canvasFull.offsetWidth - offsetRight;
                sWidth = offsetHeight;
                sHeight = offsetWidth;
            } else if (this.rotateStep === 2) {
                srcX = this.canvasFull.offsetWidth - offsetRight;
                srcY = this.canvasFull.offsetHeight - offsetBottom;
                sWidth = offsetWidth;
                sHeight = offsetHeight;
            } else if (this.rotateStep === 3) {
                srcX = this.canvasFull.offsetHeight - offsetBottom;
                srcY = offsetLeft;
                sWidth = offsetHeight;
                sHeight = offsetWidth;
            }

            srcX *= this.RATIO_PIXEL;
            srcY *= this.RATIO_PIXEL;
            sWidth *= this.RATIO_PIXEL;
            sHeight *= this.RATIO_PIXEL;

            return {
                srcX: srcX,
                srcY: srcY,
                sWidth: sWidth,
                sHeight: sHeight
            };
        }
    }, {
        key: 'getRealCoordinate',
        value: function getRealCoordinate(mouseX, mouseY) {
            // 获取真实坐标系（旋转缩放后的）
            var x = mouseX;
            var y = mouseY;

            if (this.rotateStep === 1) {
                x = mouseY;
                y = this.canvasFull.offsetWidth - mouseX;
            } else if (this.rotateStep === 2) {
                x = this.canvasFull.offsetWidth - mouseX;
                y = this.canvasFull.offsetHeight - mouseY;
            } else if (this.rotateStep === 3) {
                x = this.canvasFull.offsetHeight - mouseY;
                y = mouseX;
            }

            x *= this.RATIO_PIXEL;
            y *= this.RATIO_PIXEL;

            return {
                x: x,
                y: y
            };
        }
    }, {
        key: 'drawImage',
        value: function drawImage() {
            // 宽高在旋转不同的情况下是颠倒的
            if (this.rotateStep & 1) {
                this.ctxFull.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvasFull.height, this.canvasFull.width);
            } else {
                this.ctxFull.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvasFull.width, this.canvasFull.height);
            }
        }
    }, {
        key: 'drawMask',
        value: function drawMask() {
            this.ctxFull.save();

            this.ctxFull.fillStyle = 'rgba(0, 0, 0, 0.3)';
            if (this.rotateStep & 1) {
                this.ctxFull.fillRect(0, 0, this.canvasFull.height, this.canvasFull.width);
            } else {
                this.ctxFull.fillRect(0, 0, this.canvasFull.width, this.canvasFull.height);
            }

            this.ctxFull.restore();
        }
    }, {
        key: 'drawMag',
        value: function drawMag() {
            var captureRadius = this.options.captureRadius;
            var centerPoint = this.getRealCoordinate(this.curX, this.curY);
            var sWidth = captureRadius * 2;
            var sHeight = captureRadius * 2;
            var srcX = centerPoint.x - captureRadius;
            var srcY = centerPoint.y - captureRadius;

            if (this.rotateStep & 1) {
                this.ctxMag.clearRect(0, 0, this.canvasMag.height, this.canvasMag.width);
            } else {
                this.ctxMag.clearRect(0, 0, this.canvasMag.width, this.canvasMag.height);
            }

            var drawX = 0;
            var drawY = 0;

            if (this.os.ios) {
                // 兼容ios的Safari不能绘制srcX,srcY为负的情况
                if (srcY < 0) {
                    // 注意先后顺序
                    drawY = this.canvasMag.height / 2 * Math.abs(srcY / captureRadius);
                    srcY = 0;
                }
                if (srcX < 0) {
                    // 注意先后顺序
                    drawX = this.canvasMag.width / 2 * Math.abs(srcX / captureRadius);
                    srcX = 0;
                }
            }

            // 生成新的图片,内部坐标会使用原图片的尺寸
            this.ctxMag.drawImage(this.img, srcX / this.scale, srcY / this.scale, sWidth / this.scale, sHeight / this.scale, drawX, drawY, this.canvasMag.width, this.canvasMag.height);

            var centerX = this.canvasMag.width / 2;
            var centerY = this.canvasMag.height / 2;
            var radius = 5 * this.RATIO_PIXEL;

            // 绘制十字校准
            this.ctxMag.beginPath();
            this.ctxMag.moveTo(centerX - radius, centerY);
            this.ctxMag.lineTo(centerX + radius, centerY);
            // this.ctxMag.arc(centerX + radius, centerY, 3, 0, 2 * Math.PI);
            this.ctxMag.moveTo(centerX, centerY - radius);
            this.ctxMag.lineTo(centerX, centerY + radius);
            // this.ctxMag.arc(centerX, centerY + radius, 3, 0, 2 * Math.PI);
            this.ctxMag.strokeStyle = '#de3c50';
            this.ctxMag.lineWidth = 3;
            this.ctxMag.stroke();
        }
    }, {
        key: 'initMagnifier',
        value: function initMagnifier() {
            this.canvasMag = document.createElement('canvas');
            this.canvasMag.className = 'magnifier clip-hidden';
            this.ctxMag = this.canvasMag.getContext('2d');
            this.smoothCtx(this.ctxMag);
            this.container.appendChild(this.canvasMag);
            this.domChildren.push(this.canvasMag);

            // 需要初始化一个高度，否则如果旋转时会造不对
            // 捕获直径*像素比
            this.canvasMag.width = this.options.captureRadius * 2 * this.RATIO_PIXEL;
            this.canvasMag.height = this.options.captureRadius * 2 * this.RATIO_PIXEL;
        }
    }, {
        key: 'initTransferCanvas',
        value: function initTransferCanvas() {
            this.canvasTransfer = document.createElement('canvas');
            this.canvasTransfer.style.display = 'none';
            this.canvasTransfer.className = 'transfer-canvas';
            this.ctxTransfer = this.canvasTransfer.getContext('2d');
            this.smoothCtx(this.ctxTransfer);
            this.container.appendChild(this.canvasTransfer);
            this.domChildren.push(this.canvasTransfer);
        }
    }, {
        key: 'smoothCtx',
        value: function smoothCtx(ctx) {
            var isSmooth = this.options.isSmooth;

            ctx.mozImageSmoothingEnabled = isSmooth;
            ctx.webkitImageSmoothingEnabled = isSmooth;
            ctx.msImageSmoothingEnabled = isSmooth;
            ctx.imageSmoothingEnabled = isSmooth;
        }
    }, {
        key: 'getRealFinalImgSize',
        value: function getRealFinalImgSize(curWidth, curHeight) {
            var wPerH = this.canvasFull.width / this.canvasFull.height;
            var maxWidth = this.options.maxWidth || 0;
            var forceWidth = this.options.forceWidth || 0;
            var forceHeight = this.options.forceHeight || 0;
            var width = curWidth;
            var height = curHeight;

            if (this.rotateStep & 1) {
                if (this.options.isUseOriginSize || this.canvasFull.width > this.img.height) {
                    // 最大不会超过原图的尺寸
                    width = this.img.width * curWidth / this.canvasFull.height;
                    height = this.img.height * curHeight / this.canvasFull.width;
                }
                if (maxWidth && this.canvasFull.height > maxWidth && maxWidth < this.img.height) {
                    // 使用最大宽，前提是原始大小也大于最大宽
                    width = maxWidth * curWidth / this.canvasFull.height;
                    height = maxWidth / wPerH * curHeight / this.canvasFull.width;
                }
                if (forceWidth) {
                    // 使用固定宽
                    width = forceWidth * curWidth / this.canvasFull.height;
                    height = (forceHeight || forceWidth / wPerH) * curHeight / this.canvasFull.width;
                }
            } else {
                if (this.options.isUseOriginSize || this.canvasFull.width > this.img.width) {
                    // 最大不会超过原图的尺寸
                    width = this.img.width * curWidth / this.canvasFull.width;
                    height = this.img.height * curHeight / this.canvasFull.height;
                }
                if (maxWidth && this.canvasFull.width > maxWidth && maxWidth < this.img.width) {
                    width = maxWidth * curWidth / this.canvasFull.width;
                    height = maxWidth / wPerH * curHeight / this.canvasFull.height;
                }
                if (forceWidth) {
                    // 使用固定宽
                    width = forceWidth * curWidth / this.canvasFull.width;
                    height = (forceHeight || forceWidth / wPerH) * curHeight / this.canvasFull.height;
                }
            }

            return {
                width: width,
                height: height
            };
        }

        /**
         * 裁剪
         */

    }, {
        key: 'clip',
        value: function clip() {
            var params = this.getClipRectParams();
            var srcX = params.srcX;
            var srcY = params.srcY;
            var sWidth = params.sWidth;
            var sHeight = params.sHeight;
            var realImgSize = this.getRealFinalImgSize(sWidth, sHeight);
            var curWidth = realImgSize.width;
            var curHeight = realImgSize.height;

            // 注意，这个变量可能不存在，会影响判断的，所以要确保它存在
            this.rotateStep = this.rotateStep || 0;

            // 计算弧度
            var degree = this.rotateStep * 90 * Math.PI / 180;

            // 内部的转换矩阵也需要旋转（只不过不需要展示而已-譬如平移操作就无必要）
            // 注意，重置canvas大小后，以前的rotate也会无效-
            // 否则如果不重置，直接rotate是会在以前的基础上
            if (this.rotateStep === 0) {
                this.canvasTransfer.width = curWidth;
                this.canvasTransfer.height = curHeight;
            } else if (this.rotateStep === 1) {
                this.canvasTransfer.width = curHeight;
                this.canvasTransfer.height = curWidth;
                this.ctxTransfer.rotate(degree);
                this.ctxTransfer.translate(0, -this.canvasTransfer.width);
            } else if (this.rotateStep === 2) {
                this.canvasTransfer.width = curWidth;
                this.canvasTransfer.height = curHeight;
                this.ctxTransfer.rotate(degree);
                this.ctxTransfer.translate(-this.canvasTransfer.width, -this.canvasTransfer.height);
            } else if (this.rotateStep === 3) {
                this.canvasTransfer.width = curHeight;
                this.canvasTransfer.height = curWidth;
                this.ctxTransfer.rotate(degree);
                this.ctxTransfer.translate(-this.canvasTransfer.height, 0);
            }

            // 生成新的图片,内部坐标会使用原图片的尺寸
            // 宽高在旋转不同的情况下是颠倒的
            if (this.rotateStep & 1) {
                this.ctxTransfer.drawImage(this.img, srcX / this.scale, srcY / this.scale, sWidth / this.scale, sHeight / this.scale, 0, 0, this.canvasTransfer.height, this.canvasTransfer.width);
            } else {
                this.ctxTransfer.drawImage(this.img, srcX / this.scale, srcY / this.scale, sWidth / this.scale, sHeight / this.scale, 0, 0, this.canvasTransfer.width, this.canvasTransfer.height);
            }

            this.clipImgData = this.canvasTransfer.toDataURL(this.options.mime, this.options.quality);
        }
    }, {
        key: 'resetClipRect',
        value: function resetClipRect() {
            this.clipRect.style.left = (this.marginLeft || 0) + 'px';
            this.clipRect.style.top = 0;
            this.clipRect.style.width = this.canvasFull.width / this.RATIO_PIXEL + 'px';
            this.clipRect.style.height = this.canvasFull.width / (this.RATIO_PIXEL * getScale()) + 'px';
            this.draw();
        }
    }, {
        key: 'getClipImgData',
        value: function getClipImgData() {
            return this.clipImgData;
        }
    }, {
        key: 'rotate',
        value: function rotate(isClockWise) {
            // 最小和最大旋转方向
            var MIN_STEP = 0;
            var MAX_STEP = 3;
            var width = this.oldWidth;
            var height = this.oldHeight;

            this.rotateStep = this.rotateStep || 0;
            this.rotateStep += isClockWise ? 1 : -1;
            if (this.rotateStep > MAX_STEP) {
                this.rotateStep = MIN_STEP;
            } else if (this.rotateStep < MIN_STEP) {
                this.rotateStep = MAX_STEP;
            }

            // 计算弧度
            var degree = this.rotateStep * 90 * Math.PI / 180;

            // 重置canvas,重新计算旋转
            this.canvasMag.width = this.canvasMag.width;
            this.canvasMag.height = this.canvasMag.height;

            // 同时旋转mag canvas
            if (this.rotateStep === 0) {
                this.resizeCanvas(width, height);
            } else if (this.rotateStep === 1) {
                this.resizeCanvas(height, width);
                this.ctxFull.rotate(degree);
                this.ctxFull.translate(0, -this.canvasFull.width);
                this.ctxMag.rotate(degree);
                this.ctxMag.translate(0, -this.canvasMag.width);
            } else if (this.rotateStep === 2) {
                this.resizeCanvas(width, height);
                this.ctxFull.rotate(degree);
                this.ctxFull.translate(-this.canvasFull.width, -this.canvasFull.height);
                this.ctxMag.rotate(degree);
                this.ctxMag.translate(-this.canvasMag.width, -this.canvasMag.height);
            } else if (this.rotateStep === 3) {
                this.resizeCanvas(height, width);
                this.ctxFull.rotate(degree);
                this.ctxFull.translate(-this.canvasFull.height, 0);
                this.ctxMag.rotate(degree);
                this.ctxMag.translate(-this.canvasMag.height, 0);
            }

            this.resetClipRect();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.clear();
            this.canvasFull = null;
            this.ctxFull = null;
            this.canvasTransfer = null;
            this.ctxTransfer = null;
            this.canvasMag = null;
            this.ctxMag = null;
            this.clipRect = null;
        }
    }]);

    return ImgClip;
}();

return ImgClip$1;

})));
$(".crop-image").html('<div class="clip-content">\
                    <div class="upload-container choose-gallery" style="display: none">\
                    <div class="upload-pretty button-three-dimen">\
                    <input type="file" id="targetImg">本地上传\
                    </div>\
                    </div>\
                    <div class="upload-container choose-camera" style="display: none">\
                    <div class="upload-pretty button-three-dimen">\
                    <input type="file" id="targetImgCamera" accept="image/*"  multiple>手机拍摄\
            </div>\
            </div>\
            <div class="img-clip"></div>\
                    <nav class="clip-action nav-bar nav-bar-tab hidden">\
                    <a class="tab-item" id="btn-reload">\
                    <span class="mui-icon mui-icon-arrowleft tab-icon"></span>\
                    <span class="tab-label hidden">取消</span>\
                    </a>\
                    <a class="tab-item " id="btn-rotate-anticlockwise">\
                    <span class="mui-icon mui-icon-refreshempty tab-icon rotate90"></span>\
                    <span class="tab-label hidden">逆时针旋转</span>\
                    </a>\
                    <a class="tab-item " id="btn-rotate-clockwise">\
                    <span class="mui-icon mui-icon-refreshempty tab-icon"></span>\
                    <span class="tab-label hidden">顺时针旋转</span>\
                    </a>\
                    <a class="tab-item hidden" id="btn-maxrect">\
                    <span class="mui-icon mui-icon-navigate tab-icon"></span>\
                    <span class="tab-label hidden">最大选择</span>\
                    </a>\
                    <a class="tab-item" id="btn-verify">\
                    <span class="mui-icon mui-icon-checkmarkempty tab-icon"></span>\
                    <span class="tab-label hidden">确定</span>\
                    </a>\
                    </nav>\
                    </div>');


var chooseGallery;
var chooseCamera;
var cropImage;
var imgData;
var clipContent;
var clipAction;
var showContent;
var showImg;
var targetImg;
var targetImgCamera;

var successFile;

initPage();

function initPage() {
    initParams();
    initListeners();
    initImgClip();
}

function initParams() {
    targetImg = document.querySelector('#targetImg');
    targetImgCamera = document.querySelector('#targetImgCamera');
    chooseGallery = document.querySelector('.choose-gallery');
    chooseCamera = document.querySelector('.choose-camera');
    clipContent = document.querySelector('.clip-content');
    clipAction = document.querySelector('.clip-action');
    showContent = document.querySelector('.show-content');
    showImg = document.querySelector('.show-img');
}

function initImgClip() {
    new FileInput({
        container: '#targetImg',
        isMulti: false,
        type: 'Image_Camera',
        success: function(b64, file, detail) {
            // console.log("选择:" + b64);
            console.log("fileName:" + file.name);

            loadImg(b64);
        },
        error: function(error) {
            console.error(error);
        }
    });
    new FileInput({
        container: '#targetImgCamera',
        isMulti: false,
        type: 'Camera',
        success: function(b64, file, detail) {
            // console.log("选择:" + b64);
            console.log("fileName:" + file.name);
            loadImg(b64);
        },
        error: function(error) {
            console.error(error);
        }
    });
}

function loadImg(b64) {
    changeImgClipShow(true);

    var img = new Image();
    img.src = b64;

    img.onload = function() {
        EXIF.getData(img, function() {
            var orientation = EXIF.getTag(this, 'Orientation');

            cropImage && cropImage.destroy();
            cropImage = new ImageClip({
                container: '.img-clip',
                img,
                // 0代表按下才显示，1恒显示，-1不显示
                sizeTipsStyle: 0,
                // 为1一般是屏幕像素x2这个宽高
                // 最终的大小为：屏幕像素*屏幕像素比（手机中一般为2）*compressScaleRatio
                compressScaleRatio: 1.1,
                // iphone中是否继续放大：x*iphoneFixedRatio
                // 最好compressScaleRatio*iphoneFixedRatio不要超过2
                iphoneFixedRatio: 1.8,
                // 减去顶部间距，底部bar,以及显示间距
                maxCssHeight: window.innerHeight - 100 - 50 - 20,
                // 放大镜捕获的图像半径
                captureRadius: 30,
                // 是否采用原图像素（不会压缩）
                isUseOriginSize: false,
                // 增加最大宽度，增加后最大不会超过这个宽度
                maxWidth: 0,
                // 是否固定框高，优先级最大，设置后其余所有系数都无用直接使用这个固定的宽，高度自适应
                forceWidth: 0,
                // 同上，但是一般不建议设置，因为很可能会改变宽高比导致拉升，特殊场景下使用
                forceHeight: 0,
                // 压缩质量
                quality: 0.92,
                mime: 'image/jpeg',
            });

            // 6代表图片需要顺时针修复（默认逆时针处理了，所以需要顺过来修复）
            switch (orientation) {
                case 6:
                    cropImage.rotate(true);
                    break;
                default:
                    break;
            }

        });
    };
}

function resizeShowImg(b64) {
    var img = new Image();

    img.src = b64;
    img.onload = showImgOnload;
}

function showImgOnload() {
    // 必须用一个新的图片加载，否则如果只用showImg的话永远都是第1张
    // margin的话由于有样式，所以自动控制了
    var width = this.width;
    var height = this.height;
    var wPerH = width / height;
    var MAX_WIDTH = Math.min(window.innerWidth, width);
    var MAX_HEIGHT = Math.min(window.innerHeight - 50 - 100, height);
    var legalWidth = MAX_WIDTH;
    var legalHeight = legalWidth / wPerH;

    if (MAX_WIDTH && legalWidth > MAX_WIDTH) {
        legalWidth = MAX_WIDTH;
        legalHeight = legalWidth / wPerH;
    }
    if (MAX_HEIGHT && legalHeight > MAX_HEIGHT) {
        legalHeight = MAX_HEIGHT;
        legalWidth = legalHeight * wPerH;
    }

    var marginTop = (window.innerHeight - 50 - legalHeight) / 2;

    showImg.style.marginTop = marginTop + 'px';
    showImg.style.width = legalWidth + 'px';
    showImg.style.height = legalHeight + 'px';
}

function changeImgClipShow(isClip) {
    if (isClip) {
        chooseGallery.classList.add('hidden');
        chooseCamera.classList.add('hidden');
        clipAction.classList.remove('hidden');
    } else {
        chooseGallery.classList.remove('hidden');
        clipContent.classList.add('hidden');
        chooseCamera.classList.remove('hidden');
        clipAction.classList.add('hidden');
        // 需要改变input，否则下一次无法change
        targetImg.value = '';
        targetImgCamera.value = '';
    }
}

function initListeners() {
    document.querySelector('#btn-reload').addEventListener('click', function() {
        cropImage && cropImage.destroy();
        changeImgClipShow(false);
    });
    // document.querySelector('#btn-back').addEventListener('click', function() {
    //     changeContent(false);
    // });
    // document.querySelector('#btn-save').addEventListener('click', function() {
    //     // downloadFile(imgData);
    //     upload(function() {
    //         tips('上传成功');
    //     });
    // });
    // document.querySelector('#btn-detail').addEventListener('click', function() {
    //     showImgDataLen(imgData);
    // });

    document.querySelector('#btn-maxrect').addEventListener('click', function() {
        if (!cropImage) {
            tips('请选择图片');
            return;
        }
        cropImage.resetClipRect();
    });

    document.querySelector('#btn-rotate-anticlockwise').addEventListener('click', function() {
        if (!cropImage) {
            tips('请选择图片');
            return;
        }
        cropImage.rotate(false);
    });

    document.querySelector('#btn-rotate-clockwise').addEventListener('click', function() {
        if (!cropImage) {
            tips('请选择图片');
            return;
        }
        cropImage.rotate(true);
    });

    document.querySelector('#btn-verify').addEventListener('click', function() {
        if (!cropImage) {
            tips('请选择图片');
            return;
        }

        var isConfirm = confirm("是否裁剪图片并处理？");

        if (isConfirm) {
            cropImage.clip(false);
            imgData = cropImage.getClipImgData();
            recognizeImg(function() {
                changeContent(true);
            }, function(error) {
                tips(JSON.stringify(error), true);
            });
        }

    });
}

function cropShow() {
    $(".crop-image .clip-content").removeClass("hidden").show();
}

function cropStart() {
    $(".crop-image #targetImgCamera").trigger("click");
}

function showImgDataLen(imgData) {
    var len = imgData.length;
    var sizeStr = len + 'B';

    if (len > 1024 * 1024) {
        sizeStr = (Math.round(len / (1024 * 1024))).toString() + 'MB';
    } else if (len > 1024) {
        sizeStr = (Math.round(len / 1024)).toString() + 'KB';
    }

    tips('处理后大小：' + sizeStr);
}

function tips(msg, isAlert) {
    if (isAlert) {
        alert(msg);
    } else {
        toast(msg);
    }
}

function toast(message) {
    var CLASS_ACTIVE = 'mui-active';
    var duration = 2000;
    var toastDiv = document.createElement('div');

    toastDiv.classList.add('mui-toast-container');
    toastDiv.innerHTML = `<div class="mui-toast-message">${message}</div>`;
    toastDiv.addEventListener('webkitTransitionEnd', () => {
        if (!toastDiv.classList.contains(CLASS_ACTIVE)) {
        toastDiv.parentNode.removeChild(toastDiv);
        toastDiv = null;
    }
});
    // 点击则自动消失
    toastDiv.addEventListener('click', () => {
        toastDiv.parentNode.removeChild(toastDiv);
    toastDiv = null;
});
    document.body.appendChild(toastDiv);
    toastDiv.classList.add(CLASS_ACTIVE);
    setTimeout(function() {
        toastDiv && toastDiv.classList.remove(CLASS_ACTIVE);
    }, duration);
}

function changeContent(isShowContent) {
    if (isShowContent) {
        // showContent.classList.remove('hidden');
        clipContent.classList.add('hidden');

//                     resizeShowImg(imgData);
        // showImg.src = imgData;
        cropSuccess(imgData,dataURLtoFile(imgData,$('input[id="targetImgCamera"]')[0].files[0].name));
        $('input[id="targetImgCamera"]').val('');
//                    console.log(imgData)

    } else {
        showContent.classList.add('hidden');
        clipContent.classList.remove('hidden');
    }
}

function b64ToBlob(urlData) {
    var arr = urlData.split(',');
    var mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
    // 去掉url的头，并转化为byte
    var bytes = window.atob(arr[1]);

    // 处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], {
        type: mime
    });
}

var scaling = 1.43902439;
function setScale(rate) {
    scaling = rate;
}

function getScale() {
    return scaling;
}

function downloadFile(content) {
    // Convert image to 'octet-stream' (Just a download, really)
    var imageObj = content.replace("image/jpeg", "image/octet-stream");
    window.location.href = imageObj;
}

function recognizeImg(success, error) {
    // 里面正常有：裁边，摆正，梯形矫正，锐化等算法操作
    success();
}

function upload(success, error) {
    success();
}


function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

