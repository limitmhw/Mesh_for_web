#pragma warning(disable:4996)///这是什么情况
#include <iostream>  
#include "include.h"
#include <fstream>
#include <OpenMesh/Core/IO/MeshIO.hh>  
#include <OpenMesh/Core/Mesh/PolyMesh_ArrayKernelT.hh>  


class WriteBinFile{
public:
	WriteBinFile(string filename) : fout(filename, std::ofstream::binary){}
	~WriteBinFile(){
		fout.close();
	}
	void put(float f){
		//cout << "float" << endl;
		MINT32 m;
		m.f = f;
		for (int i = 0; i < 4; i++){
			this->fout.put(m.c[i]);
		}
	}
	void put(int i){
		//cout << "int" << endl;
		MINT32 m;
		m.i = i;
		for (int i = 0; i < 4; i++){
			this->fout.put(m.c[i]);
		}
	}
private:
	ofstream fout;
	union MINT32{
		int i;
		float f;
		unsigned char c[4];
	};
};
union MINT32{
	int i;
	float f;
	unsigned char c[4];
};


void writemesh( Mesh &mMesh,string outfilepath){
	WriteBinFile  *fout;
	fout = new WriteBinFile(outfilepath);
	int v_num = mMesh.n_vertices();
	int f_num = mMesh.n_faces();
	cout << "v_num_:" << v_num << endl;
	cout << "f_num:" << f_num << endl;

	fout->put(v_num);
	fout->put(f_num);
	for (Mesh::VertexIter itv = mMesh.vertices_begin(); itv != mMesh.vertices_end(); ++itv){
		Mesh::Point pp = mMesh.point(*itv);
		fout->put((float)pp[0]);
		fout->put((float)pp[1]);
		fout->put((float)pp[2]);
	}
	for (Mesh::FaceIter itf = mMesh.faces_begin(); itf != mMesh.faces_end(); ++itf){
		for (Mesh::FaceVertexIter itfv = mMesh.fv_begin(*itf); itfv != mMesh.fv_end(*itf); ++itfv){
			fout->put((int)itfv->idx());
		}
	}

	delete fout;
}
int main()
{

	Mesh mMesh;
	int count;
	//string path = "../data/rabbit.obj";
	string path = "../data/3.off";
	mMesh.readModel(path);
	string filename = "C://Users//Administrator//Desktop//1.bin"; // 此处写入文件名 
	writemesh(mMesh, filename);
	cout << "over" << endl;
	getchar();
	return 0;
}

/*
11 0.7 0.4 3
*/
