function HoloGraphV2 (canvas, options = {}) {
    const data = {
        type: options.type || 'bar',
        backgroundColor: 'black',
        title: options.title || 'App Demographic',
        xTitle: options.xTitle || 'Date Range',
        yTitle: options.yTitle || 'Users (millions)',
        zTitle: options.zTitle || 'Age Groups',
        width: options.width || 10,
        x: options.dates || [
            '02/14/2019',
            '02/15/2019',
            '02/16/2019',
            '02/17/2019',
            '02/18/2019',
            '02/19/2019',
            '02/20/2019',
            '02/21/2019',
            '02/22/2019',
            '02/23/2019',
            '02/24/2019',
            '02/25/2019',
            '02/26/2019',
            '02/27/2019',
            '02/28/2019',
            '02/29/2019',
            '02/30/2019',
            '02/31/2019',
            '03/01/2019',
            '03/02/2019',
            '03/03/2019',
            '03/04/2019',
            '03/05/2019',
            '03/06/2019',
            '03/07/2019',
            '03/08/2019',
            '03/09/2019',
            '03/10/2019',
            '03/11/2019',
            '03/12/2019',
            '03/13/2019',
            '03/14/2019',
            '03/15/2019'
        ],
        y: [
    
        ],
        z: options.categories || [
            '0-12',
            '13-18',
            '19-25',
            '26-40',
            '41-100'
        ],
        values: options.data || []
    };
function makeAxis(axis, depth = 10, width = 10) {
    var loops = 10;

    switch (axis) {
        case 'x':
            loops = width;
            break;
        case 'z':
            loops = depth - 1;
            break;
    }

    var whiteMaterial = new BABYLON.StandardMaterial("whiteMaterial", scene);

    whiteMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
    whiteMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    whiteMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    whiteMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

    var grid = new BABYLON.GridMaterial("grid", scene);
    grid.gridRatio = 0.1;

    var points = [];

    var intervals = 0;
    for (var index = 0; index <= loops * 10; index++) {
        if (parseFloat((intervals.toFixed(2) % 1.0).toFixed(2)) === 0) {
            const dot = BABYLON.Mesh.CreateSphere(axis + "-sphere-" + index, 64, 0.1, scene);
            dot.color = new BABYLON.Color3(1, 1, 1);
            dot.position[axis] = intervals;
            dot.material = whiteMaterial;
        }

        var position;

        switch (axis) {
            case 'x':
                position = new BABYLON.Vector3(intervals, 0, 0);
                break;
            case 'y':
                position = new BABYLON.Vector3(0, intervals, 0);
                break;
            case 'z':
                position = new BABYLON.Vector3(0, 0, intervals);
                break;
        }

        points.push(position);
        intervals += 0.1;
    }

    var axis = BABYLON.Mesh.CreateLines(axis + "-axis-line", points, scene, true);
    axis.color = new BABYLON.Color3(1, 1, 1);
    axis.material = grid;

    return axis;
}

function makePlane(axis, depth = 10, width = 10) {
    var grid = new BABYLON.GridMaterial("grid", scene);
    grid.gridRatio = 0.1;
    grid.backFaceCulling = false;
    grid.opacity = 0.5;
    grid.alpha = 0.5;

    var plane;

    depth = depth ? depth - 1 : depth;

    switch (axis) {
        case 'xz': // bottom
            if (!depth) {
                return;
            }

            plane = new BABYLON.MeshBuilder.CreatePlane(axis + "-plane", {
                width: width,
                height: depth
            }, scene);
            plane.material = grid;
            plane.position.x = width / 2;
            plane.position.y = 0;
            plane.position.z = depth / 2;
            plane.rotation.x = BABYLON.Tools.ToRadians(90);
            break;
        case 'yz': // left
            if (!depth) {
                return;
            }

            plane = new BABYLON.MeshBuilder.CreatePlane(axis + "-plane", {
                width: depth,
                height: 10
            }, scene);
            plane.material = grid;
            plane.position.x = 0;
            plane.position.y = 5;
            plane.position.z = depth / 2;
            plane.rotation.y = BABYLON.Tools.ToRadians(90);
            break;
        case 'xy': // back
            plane = new BABYLON.MeshBuilder.CreatePlane(axis + "-plane", {
                width: width,
                height: 10
            }, scene);
            plane.material = grid;
            plane.position.x = width / 2;
            plane.position.y = 5;
            plane.position.z = depth;
            break;
    }

    return plane;
}

function makeXLabel(text, index, parent) {
    var groundWidth = 2;
    var groundHeight = 1;

    var ground = BABYLON.MeshBuilder.CreateGround("xLabel-" + index, { width: groundWidth, height: groundHeight, subdivisions: 8 }, scene);
    ground.position.x = -0.6 + index;
    ground.position.y = -1.1;
    ground.position.z = 0;
    ground.rotation.x = BABYLON.Tools.ToRadians(-35);
    ground.rotation.y = BABYLON.Tools.ToRadians(-90);
    ground.rotation.z = BABYLON.Tools.ToRadians(90);
    ground.parent = parent;

    if (!parent.xLabels) {
        parent.xLabels = [];
    }

    parent.xLabels.push(ground);

    var textureResolution = 1024;
    var textureGround = new BABYLON.DynamicTexture("xLabelTexture-" + index, { width: 1024, height: 512 }, scene);
    var textureContext = textureGround.getContext();
    textureContext.textAlign = 'end';
    textureContext.clearRect(0, 0, 1024, 512);

    var materialGround = new BABYLON.StandardMaterial("xLabelMat-" + index, scene);
    materialGround.hasAlpha = true;
    materialGround.backFaceCulling = false;
    materialGround.specularColor = new BABYLON.Color3(0, 0, 0);
    materialGround.opacityTexture = textureGround;
    materialGround.diffuseTexture = textureGround;
    ground.material = materialGround;

    var font = "bold 150px monospace";
    textureGround.drawText(text, 1024, 290, font, "white", "transparent", true, true);
}

function makeYLabel(text, index) {
    var groundWidth = 2;
    var groundHeight = 1;

    var ground = BABYLON.MeshBuilder.CreateGround("yLabel-" + index, { width: groundWidth, height: groundHeight, subdivisions: 8 }, scene);
    ground.position.x = -1.3;
    ground.position.y = index;
    ground.position.z = 0;
    ground.rotation.x = BABYLON.Tools.ToRadians(-90);
    ground.rotation.y = BABYLON.Tools.ToRadians(-90);
    ground.rotation.z = BABYLON.Tools.ToRadians(90);

    var textureResolution = 1024;
    var textureGround = new BABYLON.DynamicTexture("yLabelTexture-" + index, { width: 1024, height: 512 }, scene);
    var textureContext = textureGround.getContext();
    textureContext.textAlign = 'end';
    textureContext.clearRect(0, 0, 1024, 512);

    var materialGround = new BABYLON.StandardMaterial("yLabelMat-" + index, scene);
    materialGround.hasAlpha = true;
    materialGround.backFaceCulling = false;
    materialGround.specularColor = new BABYLON.Color3(0, 0, 0);
    materialGround.opacityTexture = textureGround;
    materialGround.diffuseTexture = textureGround;
    ground.material = materialGround;

    var font = "bold 150px monospace";
    textureGround.drawText(text, 1024, 300, font, "white", "transparent", true, true);
}

function makeZLabel(text, index) {
    var groundWidth = 2;
    var groundHeight = 1;

    var ground = BABYLON.MeshBuilder.CreateGround("zLabel-" + index, { width: groundWidth, height: groundHeight, subdivisions: 8 }, scene);
    ground.position.x = 0;
    ground.position.y = -1.1;
    ground.position.z = 0.6 + index;
    ground.rotation.x = BABYLON.Tools.ToRadians(-35);
    ground.rotation.y = BABYLON.Tools.ToRadians(0);
    ground.rotation.z = BABYLON.Tools.ToRadians(90);

    var textureResolution = 1024;
    var textureGround = new BABYLON.DynamicTexture("zLabelTexture-" + index, { width: 1024, height: 512 }, scene);
    var textureContext = textureGround.getContext();
    textureContext.textAlign = 'end';
    textureContext.clearRect(0, 0, 1024, 512);

    var materialGround = new BABYLON.StandardMaterial("zLabelMat-" + index, scene);
    materialGround.hasAlpha = true;
    materialGround.backFaceCulling = false;
    materialGround.specularColor = new BABYLON.Color3(0, 0, 0);
    materialGround.opacityTexture = textureGround;
    materialGround.diffuseTexture = textureGround;
    ground.material = materialGround;

    var font = "bold 150px monospace";
    textureGround.drawText(text, 1024, 290, font, "white", "transparent", true, true);
}

function makeOriginDot() {
    var whiteMaterial = new BABYLON.StandardMaterial("whiteMaterial", scene);

    whiteMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
    whiteMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    whiteMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    whiteMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

    const dot = BABYLON.Mesh.CreateSphere("sphere-origin", 64, 0.3, scene);
    dot.color = new BABYLON.Color3(1, 1, 1);
    dot.material = whiteMaterial;
}

function createHoverLabel() {
    var groundWidth = 2;
    var groundHeight = 1;

    var ground = BABYLON.MeshBuilder.CreateGround('floatingLabel', { width: groundWidth, height: groundHeight, subdivisions: 8 }, scene);

    ground.rotation.x = BABYLON.Tools.ToRadians(-90);
    ground.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    var textureResolution = 1024;
    var textureGround = new BABYLON.DynamicTexture('floatingTexture', { width: 1024, height: 512 }, scene);
    var textureContext = textureGround.getContext();
    textureContext.textAlign = 'center';
    textureContext.clearRect(0, 0, 1024, 512);

    var materialGround = new BABYLON.StandardMaterial('floatingMat', scene);
    materialGround.hasAlpha = true;
    materialGround.backFaceCulling = false;
    materialGround.specularColor = new BABYLON.Color3(0, 0, 0);
    materialGround.opacityTexture = textureGround;
    materialGround.diffuseTexture = textureGround;
    ground.material = materialGround;

    return ground;
}

function createSphere(x, z, value, parent, max) {
    var yPos = value ? 10 * value / max : 0;

    var blueMaterial = new BABYLON.StandardMaterial("blueMaterial", scene);

    blueMaterial.diffuseColor = decimalToRgb(yPos / 10);
    blueMaterial.specularColor = decimalToRgb(yPos / 10);
    blueMaterial.emissiveColor = decimalToRgb(yPos / 10);
    blueMaterial.ambientColor = decimalToRgb(yPos / 10);
    blueMaterial.alpha = 0.7;

    const sphere = new BABYLON.Mesh.CreateSphere(`sphere-${x}-${z}`, 64, 0.3, scene);
    sphere.material = blueMaterial;

    sphere.position.y = 0;
    sphere.position.x = x;
    sphere.position.z = z;

    sphere.isPickable = true;

    sphere.actionManager = new BABYLON.ActionManager(scene);

    //ON MOUSE ENTER
    sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
        sphere.material.alpha = 1;

        onHover(value, sphere.absolutePosition, data.x[x], data.z[z], 'sphere');
    }));

    //ON MOUSE EXIT
    sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
        sphere.material.alpha = 0.7;

        onUnhover();
    }));

    sphere.parent = parent;

    if (!parent.spheres) {
        parent.spheres = [];
    }

    parent.spheres.push(sphere);

    animate(
        `scaleSphereAnimation-${x}-${z}-scale`,
        'scaling.y', [{
            frame: 0,
            value: 0
        }, {
            frame: 100,
            value: 1
        }],
        sphere
    );

    animate(
        `scaleSphereAnimation-${x}-${z}-ypos`,
        'position.y', [{
            frame: 0,
            value: 0
        }, {
            frame: 100,
            value: yPos
        }],
        sphere
    );
}

function createBar(x, z, value, parent, max) {
    var yPos = value ? 10 * value / max / 2 : 0;
    
    var blueMaterial = new BABYLON.StandardMaterial("blueMaterial", scene);

    blueMaterial.diffuseColor = decimalToRgb(yPos * 2 / 10);
    blueMaterial.specularColor = decimalToRgb(yPos * 2 / 10);
    blueMaterial.emissiveColor = decimalToRgb(yPos * 2 / 10);
    blueMaterial.ambientColor = decimalToRgb(yPos * 2 / 10);
    blueMaterial.alpha = 0.6;

    //blueMaterial.diffuseTexture = new BABYLON.Texture("textures/plasma.gif", scene);

    const bar = new BABYLON.MeshBuilder.CreateCylinder(`bar-${x}-${z}`, {
        height: 10 * value / max,
        diameter: 0.3
    }, scene);
    bar.material = blueMaterial;

    bar.position.y = 0;
    bar.position.x = x;
    bar.position.z = z;

    bar.isPickable = true;

    bar.actionManager = new BABYLON.ActionManager(scene);

    //ON MOUSE ENTER
    bar.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
        bar.material.alpha = 1;

        onHover(value, bar.absolutePosition, data.x[x], data.z[z], 'cylinder');
    }));

    //ON MOUSE EXIT
    bar.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
        bar.material.alpha = 0.6;

        onUnhover();
    }));

    bar.parent = parent;

    if (!parent.bars) {
        parent.bars = [];
    }

    parent.bars.push(bar);

    animate(
        `scaleBarAnimation-${x}-${z}-scale`,
        'scaling.y', [{
            frame: 0,
            value: 0
        }, {
            frame: 100,
            value: 1
        }],
        bar
    );

    animate(
        `scaleBarAnimation-${x}-${z}-scale`,
        'scaling.x', [{
            frame: 0,
            value: 0
        }, {
            frame: 100,
            value: 1
        }],
        bar
    );

    animate(
        `scaleBarAnimation-${x}-${z}-scale`,
        'scaling.z', [{
            frame: 0,
            value: 0
        }, {
            frame: 100,
            value: 1
        }],
        bar
    );

    animate(
        `scaleBarAnimation-${x}-${z}-ypos`,
        'position.y', [{
            frame: 0,
            value: 0
        }, {
            frame: 100,
            value: yPos
        }],
        bar
    );
}

function animate(name, property, keys, target) {
    var easingFunction = new BABYLON.BounceEase();

    var animation = new BABYLON.Animation(
        name,
        property,
        60,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    animation.setEasingFunction(easingFunction);

    animation.setKeys(keys);

    target.animations.push(animation);

    scene.beginAnimation(target, 0, 100, true);
}

var lines = [];

function createLine(values, from, to, animated, max) {
    var blueMaterial = new BABYLON.StandardMaterial("blueMaterial", scene);

    blueMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
    blueMaterial.specularColor = new BABYLON.Color3(0, 0, 0.87);
    blueMaterial.emissiveColor = new BABYLON.Color3(0, 0, 1);
    blueMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
    blueMaterial.alpha = 0.5;

    var points = [];

    for (var i = 0; i < values.length; i++) {
        if (i >= from && i < to) {
            var yPos = values[i].value ? 10 * values[i].value / max : 0;

            var point = new BABYLON.Vector3(values[i].x - from, yPos, values[i].z);
            points.push(point);
        }
    }

    var line = new BABYLON.Mesh.CreateLines(`line`, points, scene, true);

    //line.material = blueMaterial;
    line.color = new BABYLON.Color3(1, 1, 1);

    lines.push(line);

    if (animated) {
        return;
    }

    animate(
        `scaleLineAnimation-scale`,
        'scaling.y', [{
            frame: 0,
            value: 0
        }, {
            frame: 100,
            value: 1
        }],
        line
    );
}

var label;

function onHover(text, position, time, category, shape = 'cylinder') {
    if (label) {
        label.setEnabled(true);

        var font = "bold 130px monospace";

        var multiplier = 2;

        switch (shape) {
            case 'cylinder':
                multiplier = 2;
                break;
            case 'sphere':
                multiplier = 1;
                break;
            default:
                multiplier = 1;
        }

        label.position = {
            x: position.x,
            y: (position.y * multiplier) + 0.5,
            z: position.z
        };

        label.material.diffuseTexture.getContext().clearRect(0, 0, 1024, 512);

        if (text) {
            label.material.diffuseTexture.drawText('X: ' + time, 512, 100, font, "white", "transparent", true, true);
        }
        if (category) {
            label.material.diffuseTexture.drawText('Y: ' + text, 512, 250, font, "white", "transparent", true, true);
        }
        if (time) {
            label.material.diffuseTexture.drawText('Z: ' + category, 512, 400, font, "white", "transparent", true, true);
        }
    }
}

function onUnhover() {
    if (label) {
        label.setEnabled(false);
    }
}

function makeTitle(text, depth = 10, width = 10) {
    var groundWidth = 10;
    var groundHeight = 5;

    var ground = BABYLON.MeshBuilder.CreateGround("title", { width: groundWidth, height: groundHeight, subdivisions: 8 }, scene);
    ground.position.x = width / 2;
    ground.position.y = 12;
    ground.position.z = depth / 2;
    ground.rotation.x = BABYLON.Tools.ToRadians(-90);
    ground.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    var textureResolution = 1024;
    var textureGround = new BABYLON.DynamicTexture("titleTexture", { width: 1024, height: 512 }, scene);
    var textureContext = textureGround.getContext();
    textureContext.textAlign = 'center';
    textureContext.clearRect(0, 0, 1024, 512);

    var materialGround = new BABYLON.StandardMaterial("titleMat", scene);
    materialGround.hasAlpha = true;
    materialGround.backFaceCulling = false;
    materialGround.specularColor = new BABYLON.Color3(0, 0, 0);
    materialGround.opacityTexture = textureGround;
    materialGround.diffuseTexture = textureGround;
    ground.material = materialGround;

    var font = "bold 120px monospace";
    textureGround.drawText(text, 512, 290, font, "white", "transparent", true, true);
}

function makeXTitle(text, width = 10) {
    var groundWidth = 10;
    var groundHeight = 5;

    var ground = BABYLON.MeshBuilder.CreateGround("xCategory", { width: groundWidth, height: groundHeight, subdivisions: 8 }, scene);
    ground.position.x = width / 2;
    ground.position.y = -3;
    ground.rotation.x = BABYLON.Tools.ToRadians(-90);

    var textureResolution = 1024;
    var textureGround = new BABYLON.DynamicTexture("xCategoryTexture", { width: 1024, height: 512 }, scene);
    var textureContext = textureGround.getContext();
    textureContext.textAlign = 'center';
    textureContext.clearRect(0, 0, 1024, 512);

    var materialGround = new BABYLON.StandardMaterial("xCategoryMat", scene);
    materialGround.hasAlpha = true;
    materialGround.backFaceCulling = false;
    materialGround.specularColor = new BABYLON.Color3(0, 0, 0);
    materialGround.opacityTexture = textureGround;
    materialGround.diffuseTexture = textureGround;
    ground.material = materialGround;

    var font = "bold 100px monospace";
    textureGround.drawText(text, 512, 290, font, "white", "transparent", true, true);
}

function makeYTitle(text) {
    var groundWidth = 10;
    var groundHeight = 5;

    var ground = BABYLON.MeshBuilder.CreateGround("yCategory", { width: groundWidth, height: groundHeight, subdivisions: 8 }, scene);
    ground.position.x = -3;
    ground.position.y = 5;
    ground.rotation.y = BABYLON.Tools.ToRadians(-90);
    ground.rotation.z = BABYLON.Tools.ToRadians(90);

    var textureResolution = 1024;
    var textureGround = new BABYLON.DynamicTexture("yCategoryTexture", { width: 1024, height: 512 }, scene);
    var textureContext = textureGround.getContext();
    textureContext.textAlign = 'center';
    textureContext.clearRect(0, 0, 1024, 512);

    var materialGround = new BABYLON.StandardMaterial("yCategoryMat", scene);
    materialGround.hasAlpha = true;
    materialGround.backFaceCulling = false;
    materialGround.specularColor = new BABYLON.Color3(0, 0, 0);
    materialGround.opacityTexture = textureGround;
    materialGround.diffuseTexture = textureGround;
    ground.material = materialGround;

    var font = "bold 100px monospace";
    textureGround.drawText(text, 512, 290, font, "white", "transparent", true, true);
}

function makeZTitle(text, length) {
    var groundWidth = 10;
    var groundHeight = 5;

    var ground = BABYLON.MeshBuilder.CreateGround("zCategory", { width: groundWidth, height: groundHeight, subdivisions: 8 }, scene);

    ground.position.x = 0;
    ground.position.y = -3;
    ground.position.z = (length - 1) / 2;
    ground.rotation.x = BABYLON.Tools.ToRadians(-90);
    ground.rotation.y = BABYLON.Tools.ToRadians(0);
    ground.rotation.z = BABYLON.Tools.ToRadians(90);

    var textureResolution = 1024;
    var textureGround = new BABYLON.DynamicTexture("zCategoryTexture", { width: 1024, height: 512 }, scene);
    var textureContext = textureGround.getContext();
    textureContext.textAlign = 'center';
    textureContext.clearRect(0, 0, 1024, 512);

    var materialGround = new BABYLON.StandardMaterial("zCategoryMat", scene);
    materialGround.hasAlpha = true;
    materialGround.backFaceCulling = false;
    materialGround.specularColor = new BABYLON.Color3(0, 0, 0);
    materialGround.opacityTexture = textureGround;
    materialGround.diffuseTexture = textureGround;
    ground.material = materialGround;

    var font = "bold 100px monospace";
    textureGround.drawText(text, 512, 290, font, "white", "transparent", true, true);
}

function addXSlider(length, target, width = 10, max) {
    width = width + 1;

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var panel = new BABYLON.GUI.StackPanel();
    panel.width = "520px";
    panel.top = '-30px';
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(panel);

    var header = new BABYLON.GUI.TextBlock();
    header.text = '';
    header.height = "30px";
    header.color = "white";

    panel.addControl(header);

    var slider = new BABYLON.GUI.Slider();
    slider.minimum = 0;
    slider.maximum = length - width;
    slider.value = length - width;
    slider.height = "20px";
    slider.width = "200px";
    slider.background = 'white';
    slider.isThumbClamped = true;
    slider.borderColor = 'black';

    slider.onValueChangedObservable.add(function (value) {
        onSliderChange(value, target, width, header, max);
    });

    onSliderChange(slider.value, target, width, header, max);

    panel.addControl(slider);
}

function onSliderChange(value, target, width, header, max) {
    var rounded = Math.round(value);
    target.position.x = -rounded;

    var from = data.x[rounded];
    var to = data.x[rounded + width - 1] ? data.x[rounded + width - 1] : data.x[data.x.length - 1];

    header.text = `${from} - ${to}`;

    for (var key in target.barLabelsGroup.xLabels) {
        if (parseInt(key) >= rounded && parseInt(key) < (rounded + width)) {
            target.barLabelsGroup.xLabels[key].isVisible = true;
        } else {
            target.barLabelsGroup.xLabels[key].isVisible = false;
        }
    }

    if (data.type === 'bar') {
        for (var key in target.barValuesGroup.bars) {
            if (target.barValuesGroup.bars[key].position.x >= rounded && target.barValuesGroup.bars[key].position.x < (rounded + width)) {
                target.barValuesGroup.bars[key].isVisible = true;
            } else {
                target.barValuesGroup.bars[key].isVisible = false;
            }
        }
    }

    if (data.type === 'line') {
        for (var key in target.spheresGroup.spheres) {
            if (target.spheresGroup.spheres[key].position.x >= rounded && target.spheresGroup.spheres[key].position.x < (rounded + width)) {
                target.spheresGroup.spheres[key].isVisible = true;
            } else {
                target.spheresGroup.spheres[key].isVisible = false;
            }
        }

        updateLines(rounded, rounded + width, max);
    }
}

var lineGroups = [];
var linesAnimated = false;

function updateLines(from, to, max) {
    for (var key in lines) {
        lines[key].setEnabled(false);
        lines[key].dispose();
    }

    lines = [];

    if (!lineGroups.length) {
        lineGroups = _.groupBy(data.values, 'z');
    }

    for (var key in lineGroups) {
        createLine(lineGroups[key], from, to, linesAnimated, max);
    }

    linesAnimated = true;
}

function decimalToRgb(decimal = 1) {
    //decimal = 1 - decimal;
    var t = (decimal * 60) - 30;

    var hue = 30 + 240 * (30 - t) / 60;

    var rgb = new tinycolor({ h: hue - 30, s: 80, l: 50 }).toRgb();

    return new BABYLON.Color3(rgb.r / 255, rgb.g / 255, rgb.b / 255);
}

function colorToV3Color(string) {
    var rgb = new tinycolor(string).toRgb();

    return new BABYLON.Color3(rgb.r / 255, rgb.g / 255, rgb.b / 255);
}

var scene;

var createScene = function () {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = colorToV3Color(data.backgroundColor);
    scene.ambientColor = colorToV3Color('white');

    const depth = data.z.length;

    var camera = new BABYLON.ArcRotateCamera(
        "camera",
        - Math.PI / 3,
        5 * Math.PI / 12, 30,
        new BABYLON.Vector3(data.width / 2, 2.5, depth / 2),
        scene
    );
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 3;

    engine.runRenderLoop(function () {
        light.position = camera.position;
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });

    makeOriginDot();

    makeAxis('x', depth, data.width);
    makeAxis('y', depth, data.width);

    if (depth) {
        makeAxis('z', depth, data.width);

        makePlane('xz', depth, data.width);
        makePlane('yz', depth, data.width);
    }

    makePlane('xy', depth, data.width);

    var barGroup = BABYLON.MeshBuilder.CreateBox("BarGroup", {}, scene);
    barGroup.isVisible = false;

    var barLabelsGroup = BABYLON.MeshBuilder.CreateBox("BarLabelsGroup", {}, scene);
    barLabelsGroup.isVisible = false;

    var barValuesGroup = BABYLON.MeshBuilder.CreateBox("BarValuesGroup", {}, scene);
    barValuesGroup.isVisible = false;

    var spheresGroup = BABYLON.MeshBuilder.CreateBox("SpheresGroup", {}, scene);
    spheresGroup.isVisible = false;

    if (!data.values.length) {
        for (var i = 0; i < data.x.length; i++) {
            for (var j = 0; j < (depth || 1); j++) {
                data.values.push({
                    x: i,
                    z: j,
                    value: (Math.random() * 10).toFixed(2)
                });
            }
        }
    }

    var max = 0;

    for (var key in data.values) {
        if (data.values[key].value > max) {
            max = data.values[key].value;
        }
    }

    var step = Math.round(max) / 10;

    for (var i = 0; i <= 10; i++) {
        data.y.push('' + parseFloat(step * i).toFixed(1));
    }

    for (var key in data.x) {
        makeXLabel(data.x[key], parseInt(key), barLabelsGroup);
    }

    makeTitle(data.title, depth, data.width);

    makeXTitle(data.xTitle, data.width);
    makeYTitle(data.yTitle);

    if (depth) {
        makeZTitle(data.zTitle, depth);
    }

    for (var key in data.y) {
        makeYLabel(data.y[key], parseInt(key));
    }

    for (var key in data.z) {
        makeZLabel(data.z[key], parseInt(key));
    }

    for (var key in data.values) {
        if (data.type === 'bar') {
            createBar(data.values[key].x, data.values[key].z, data.values[key].value, barValuesGroup, max);
        }

        if (data.type === 'line') {
            createSphere(data.values[key].x, data.values[key].z, data.values[key].value, spheresGroup, max);
        }
    }

    barLabelsGroup.parent = barGroup;
    barValuesGroup.parent = barGroup;
    spheresGroup.parent = barGroup;

    barGroup.barLabelsGroup = barLabelsGroup;
    barGroup.barValuesGroup = barValuesGroup;
    barGroup.spheresGroup = spheresGroup;

    label = createHoverLabel();

    addXSlider(data.x.length, barGroup, data.width, max);

    return scene;
};

var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
createScene();

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});

window.addEventListener("resize", function () {
    engine.resize();
});
}