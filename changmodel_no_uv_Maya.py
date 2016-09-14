#coding=utf-8
''''' 
Created on 2016-09-01 
@author: Administrator
''''' 
import re
import struct
#inputfilepath='youjiao8k_no_t.obj'
inputfilepath='youjiao8k.obj'
outputfilepath='normal_no_t.maya'
vertex_arr=[]
face_arr=[]
uv_arr=[]

if __name__ == '__main__':
        # inputfilepath
        #global outputfilepath
        #global vertex_arr
        #global face_arr
        #global uv_arr

        in_file_object = open(inputfilepath)
        try:
                all_data = in_file_object.read( )
        finally:
                in_file_object.close( )
        all_data_arr= all_data.split('\n')
        vertex_pattern = re.compile(r'v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)')
        face_pattern1 = re.compile(r'f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?') 
        face_pattern2 = re.compile(r'f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?') 
        uv_pattern = re.compile(r'vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)')
                        


        for i in  all_data_arr:
                vertex = vertex_pattern.match(i)
                face1 = face_pattern1.match(i)
                face2 = face_pattern2.match(i)
                uv = uv_pattern.match(i)
                if vertex:
                        v=[]
                        v.append(float(vertex.group(1)))
                        v.append(float(vertex.group(2)))
                        v.append(float(vertex.group(3)))
                        vertex_arr.append(v)
                if face1:
                        f=[]
                        f.append(int(face1.group(1)))
                        f.append(int(face1.group(2)))
                        f.append(int(face1.group(3)))
                        face_arr.append(f)
                if face2:
                        f=[]
                        f.append(int(face2.group(2)))
                        f.append(int(face2.group(3)))
                        f.append(int(face2.group(5)))
                        f.append(int(face2.group(6)))
                        f.append(int(face2.group(8)))
                        f.append(int(face2.group(9)))
                        face_arr.append(f)
                if uv:
                        u=[]
                        u.append(float(uv.group(1)))
                        u.append(float(uv.group(2)))
                        uv_arr.append(u)
        out_file_object=open(outputfilepath,'wb')
        head='Autodesk Maya. All Rights Reserved.'
        head_hex= struct.pack("c",'.')
        
        out_file_object.write(head)
        out_file_object.write(head_hex)
        print len(vertex_arr)
        print len(face_arr)
        print len(uv_arr)
    
        v_num = struct.pack("i",len(vertex_arr))
        f_num = struct.pack("i",len(face_arr))
        u_num = struct.pack("i",len(uv_arr))
        out_file_object.write(v_num)
        out_file_object.write(f_num)
        out_file_object.write(u_num)
        

        for i in vertex_arr:
                for j in i:
                        v=struct.pack("f",j)
                        out_file_object.write(v)
        for i in face_arr:
                for j in i:
                        f=struct.pack("i",j)
                        out_file_object.write(f)
        for i in uv_arr:
                for j in i:
                        u=struct.pack("f",j)
                        out_file_object.write(u)
        out_file_object.close( )

                                
       
