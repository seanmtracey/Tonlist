import ftplib
import os
import sys
import traceback
import urllib2

print("Parsing XML - This can take a while")

import parseiTunes

#Script adapted from http://zephyrfalcon.org/weblog/arch_d7_2003_06_28.html#e262

print "Logging in..."
root = "/sean.mtracey.org/stuff/tonlist/music"
ftp = ftplib.FTP()
ftp.connect("leah.dreamhost.com", 21)
print ftp.getwelcome()
try:
    try:
        ftp.login("USERNAME", "PASSWORD")
        ftp.cwd(root)
        # move to the desired upload directory
        print "Currently in:", ftp.pwd()
        #Point this to your iTunes library XML
        iTunesXML = "/Users/YOUR USER NAME/Music/iTunes/iTunes Music Library.xml"
        uploadFiles = []
        for track in parseiTunes.trackdict: 
            song = parseiTunes.trackdict.get(track)
            uploadFiles.append(urllib2.unquote(song.get('Location','')))
        for fileToUpload in uploadFiles:
            rootname = fileToUpload
            rootname = rootname.replace("%20", " ")
            splitname = rootname.split('file://localhost')
            fullname = splitname[len(splitname) - 1]
            splitFileName = fullname.split('/')
            name = splitFileName[len(splitFileName) - 1]

            for n in range(6, len(splitFileName) - 1):
                filelist = [] #to store all files
                ftp.retrlines('NLST', filelist.append)    # append to list  
            
                if len(filelist) == 0:
                    print("Folder '" + splitFileName[n] + "' not found\nMaking directory")
                    ftp.mkd(splitFileName[n])
                    ftp.cwd(splitFileName[n])
                else:
                    found = 0
                    for f in filelist:
                        if splitFileName[n] in f:
                            print("Directory '" + splitFileName[n] + "' Exists... Opening...")
                            ftp.cwd(splitFileName[n])
                            print(ftp.pwd())
                            found = 1
                    if found == 0:
                        print("Folders were found but were not " + splitFileName[n] + "...\nMaking Directory...")
                        ftp.mkd(splitFileName[n])
                        ftp.cwd(splitFileName[n])
                
                if(n == len(splitFileName) - 2):                            
                    print("Reached final directory...")
                    filelist = []
                    ftp.retrlines('NLST', filelist.append)
                    
                    fileFound = 0
                
                    print(name)
                    for x in filelist:
                        if fileFound == 1:
                            break
                        
                        if x == name:
                            fileFound = 1
                        else:
                            fileFound = 0
                    
                    if fileFound == 1:
                           print("File already exists... Not uploading...")
                           ftp.cwd(root)
                    else:
                        print("Uploading '" + name + "'...")
                        f = open(fullname, "rb")
                        ftp.storbinary('STOR ' + name, f)
                        f.close()
                        ftp.cwd(root)
    finally:
        print "All uploads completed - Quitting..."
        ftp.quit()
except:
    traceback.print_exc()
        
raw_input("Press Enter to exit...")