THREE.BinLoader = function (manager) {
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
};
THREE.BinLoader.prototype = {
	constructor : THREE.BinLoader,
	load : function (url, onLoad, onProgress, onError) {
		var scope = this;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function (e) {
			text = this.response;
			console.log(text);
			onLoad(scope.parse(text));
		}
		xhr.send();
	},
	parse : function (text) {
		function vector(x, y, z) {
			return new THREE.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
		}
		function uv(u, v) {
			return new THREE.Vector2(parseFloat(u), parseFloat(v));
		}
		function face3(a, b, c, normals) {
			return new THREE.Face3(a, b, c, normals);
		}
		var object = new THREE.Object3D();
		var geometry,
		material,
		mesh;
		function parseVertexIndex(index) {
			index = parseInt(index);
			return index >= 0 ? index - 1 : index + vertices.length;
		}
		function parseNormalIndex(index) {
			index = parseInt(index);
			return index >= 0 ? index - 1 : index + normals.length;
		}
		function parseUVIndex(index) {
			index = parseInt(index);
			return index >= 0 ? index - 1 : index + uvs.length;
		}
		function add_face(a, b, c, normals_inds) {
			if (normals_inds === undefined) {
				geometry.faces.push(face3(vertices[parseVertexIndex(a)] - 1, vertices[parseVertexIndex(b)] - 1, vertices[parseVertexIndex(c)] - 1));
			} else {
				geometry.faces.push(face3(vertices[parseVertexIndex(a)] - 1, vertices[parseVertexIndex(b)] - 1, vertices[parseVertexIndex(c)] - 1, [normals[parseNormalIndex(normals_inds[0])].clone(), normals[parseNormalIndex(normals_inds[1])].clone(), normals[parseNormalIndex(normals_inds[2])].clone()]));
			}
		}
		function add_uvs(a, b, c) {
			geometry.faceVertexUvs[0].push([uvs[parseUVIndex(a)].clone(), uvs[parseUVIndex(b)].clone(), uvs[parseUVIndex(c)].clone()]);
		}
		function handle_face_line(faces, uvs, normals_inds) {
			if (faces[3] === undefined) {
				add_face(faces[0], faces[1], faces[2], normals_inds);
				if (uvs !== undefined && uvs.length > 0) {
					add_uvs(uvs[0], uvs[1], uvs[2]);
				}
			} else {
				if (normals_inds !== undefined && normals_inds.length > 0) {
					add_face(faces[0], faces[1], faces[3], [normals_inds[0], normals_inds[1], normals_inds[3]]);
					add_face(faces[1], faces[2], faces[3], [normals_inds[1], normals_inds[2], normals_inds[3]]);
				} else {
					add_face(faces[0], faces[1], faces[3]);
					add_face(faces[1], faces[2], faces[3]);
				}
				if (uvs !== undefined && uvs.length > 0) {
					add_uvs(uvs[0], uvs[1], uvs[3]);
					add_uvs(uvs[1], uvs[2], uvs[3]);
				}
			}
		}
		if (/^o /gm.test(text) === false) {
			geometry = new THREE.Geometry();
			material = new THREE.MeshLambertMaterial();
			mesh = new THREE.Mesh(geometry, material);
			object.add(mesh);
		}
		var vertices = [];
		var normals = [];
		var uvs = [];
		var baseinfo = new Int32Array(text, 0, 3);
		var v_data = new Float32Array(text, 4 * 3, baseinfo[0] * 3);
		var f_data = new Int32Array(text, 4 * (3 + (baseinfo[0]) * 3), baseinfo[1] * 6);
		var u_data = new Float32Array(text, 4 * (3 + ((baseinfo[0]) * 3) + (baseinfo[1] * 6)), baseinfo[2] * 2);
		console.log(baseinfo);
		for (i = 0; i < v_data.length; i = i + 3) {
			vertices.push(geometry.vertices.push(vector(parseFloat(v_data[i + 0]), parseFloat(v_data[i + 1]), parseFloat(v_data[i + 2]))));
		}
		for (i = 0; i < u_data.length; i = i + 2) {
			uvs.push(uv(parseFloat(u_data[i + 0]), parseFloat(u_data[i + 1])));
		}
		for (i = 0; i < f_data.length; i = i + 6) {
			var kong;
			handle_face_line([f_data[i + 0], f_data[i + 2], f_data[i + 4], kong],
						     [f_data[i + 1], f_data[i + 3], f_data[i + 5], kong]);
		}
		var children = object.children;
		for (var i = 0, l = children.length; i < l; i++) {
			var geometry = children[i].geometry;
			geometry.computeCentroids();
			geometry.computeFaceNormals();
			geometry.computeBoundingSphere();
		}
		return object;
	}
};
