# =================================================================================================
# Project: SCAN - Searching Chemical Actions and Networks
#          Hokkaido University (2021)
#          Last Update: Q2 2023
# ________________________________________________________________________________________________
# Authors: NorthGrid (Support Dev)
#          Mikael Nicander Kuwahara (Lead Developer) [2022-]
#          Jun Fujima (Former Lead Developer) [2021]
# ________________________________________________________________________________________________
# Description: This is the observer.py file that runs in the background and detect if any new data 
#              is dropped in the dedicated data folder, and if so start the process of sucking up 
#              that data to the DB.
# ------------------------------------------------------------------------------------------------
# Notes: This was part of the NorthGrid Support in 2022 
# ------------------------------------------------------------------------------------------------
# References: 
# =================================================================================================


#-------------------------------------------------------------------------------------------------
# Import required Libraries
#-------------------------------------------------------------------------------------------------
import os
import sys
import time
import shutil
import subprocess
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

#-------------------------------------------------------------------------------------------------


#-------------------------------------------------------------------------------------------------
# Called when file is completed
#-------------------------------------------------------------------------------------------------
def file_completed(p, msg = "waiting... ", WAIT = 10):
    before = (None, None)
    wait = WAIT

    print(msg+p, flush=True)
    while True:
        if not wait: break

        file = os.stat(p)
        current = (file.st_size, file.st_mtime)
        if before == current: 
            wait-=1
        else:
            before = current
            wait = WAIT

        time.sleep(1)

#-------------------------------------------------------------------------------------------------


#-------------------------------------------------------------------------------------------------
# The Observer start doing its job of observing the dedicated data folder zip files
#-------------------------------------------------------------------------------------------------
if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else '.'
    def on_created(e):
        src = e.src_path
        file_completed(src)
        filename = os.path.splitext(os.path.basename(src))[0]
        basename = f'/tmp/{filename}'
        shutil.unpack_archive(src, basename)
        subprocess.run(['bash', 'register.sh', basename,src])
        shutil.rmtree(basename)
        print("finished ..."+src)
    event_handler = PatternMatchingEventHandler(['*.zip'])
    event_handler.on_created = on_created
    observer = Observer()
    observer.schedule(event_handler, path)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

#-------------------------------------------------------------------------------------------------
