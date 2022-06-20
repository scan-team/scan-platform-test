import os
import sys
import time
import shutil
import subprocess
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

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
