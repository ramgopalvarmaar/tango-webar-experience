// based on https://github.com/google-ar/three.ar.js/blob/master/src/experimental/ARPointCloudGeometry.js

/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as THREE from 'three';

const MAX_FLOAT32_VALUE = 3.4028e38;

export default function ARPointCloudGeometry( vrDisplay, pointCloud ) {

	THREE.BufferGeometry.call( this );

	this._vrDisplay = vrDisplay;
	// this._numberOfPointsInLastPointCloud = 0;
	this._pointCloud = pointCloud || new window.VRPointCloud();

	vrDisplay.getPointCloud( this._pointCloud, false, 0, false );

	const points = this._pointCloud.points;
	// const colors = new Float32Array( points.length );

	for ( let i = 0; i < points.length; i += 3 ) {

		points[ i ] = points[ i + 1 ] = points[ i + 2 ] = MAX_FLOAT32_VALUE;
		// colors[ i ] = colors[ i + 1 ] = colors[ i + 2 ] = 1;

	}

	this._positions = new THREE.BufferAttribute( points, 3 );
	this.addAttribute( 'position', this._positions );
	// this._colors = new THREE.BufferAttribute( colors, 3 );
	// this.addAttribute( 'color', this._colors );

	this.computeBoundingSphere();
	this.frustumCulled = false;

	return this;

}

ARPointCloudGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );

ARPointCloudGeometry.prototype.update = function ( updateGeometry ) {

	const pointsToSkip = 0;
	const transformPoints = true;

	this._vrDisplay.getPointCloud(
		this._pointCloud,
		! updateGeometry,
		pointsToSkip,
		transformPoints
	);

	if ( this._pointCloud.numberOfPoints > 0 ) {

		this._positions.needsUpdate = true;
		this.needsUpdate = true;

	}

};

// ARPointCloudGeometry.prototype.getPointCloud = function () {

// 	return this._pointCloud;

// };
