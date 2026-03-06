# run_all.py
import subprocess
import os
import sys
import signal
import shutil
from threading import Thread
import time

def start_project():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    
    backend_dir = os.path.join(root_dir, 'backend')
    frontend_dir = os.path.join(root_dir, 'frontend')

    # Prefer the current Python executable (honors venv)
    python_exe = sys.executable or 'python'
    backend_cmd = [python_exe, 'app.py']

    # Frontend: use npm (must be on PATH)
    npm = shutil.which('npm') or 'npm'
    frontend_cmd = [npm, 'run', 'dev', '--', '--port', '5174']

    print("\n" + "="*30)
    print("   SHAMIR VAULT SYSTEM   ")
    print("="*30)
    print(f"Root: {root_dir}")
    print("Backend API:  http://127.0.0.1:5000")
    print("Frontend URL: http://localhost:5174") # Updated output link
    print("-" * 30)
    
    procs = []

    def stream_proc(proc, prefix):
        for line in iter(proc.stdout.readline, b''):
            if not line:
                break
            try:
                print(f"{prefix}: " + line.decode(errors='replace').rstrip())
            except Exception:
                pass

    try:
        # Start backend
        print(f"Starting backend in: {backend_dir}")
        p_backend = subprocess.Popen(backend_cmd, cwd=backend_dir, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        procs.append((p_backend, 'BACKEND'))

        # Start frontend
        print(f"Starting frontend in: {frontend_dir}")
        p_frontend = subprocess.Popen(frontend_cmd, cwd=frontend_dir, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=(os.name=='nt'))
        procs.append((p_frontend, 'FRONTEND'))

        # Spawn threads to stream output
        threads = []
        for p, name in procs:
            t = Thread(target=stream_proc, args=(p, name), daemon=True)
            t.start()
            threads.append(t)

        # Wait for backend and frontend to become reachable (quick port detection)
        import urllib.request
        def wait_for_url(url, timeout=10.0, interval=0.5):
            start = time.time()
            while True:
                try:
                    with urllib.request.urlopen(url, timeout=2) as r:
                        return True
                except Exception:
                    if time.time() - start > timeout:
                        return False
                    time.sleep(interval)

        backend_health = 'http://127.0.0.1:5000/api/health'
        frontend_url = 'http://127.0.0.1:5174'
        print('Waiting for backend to respond...')
        if wait_for_url(backend_health, timeout=12):
            print('Backend is up')
        else:
            print('Warning: backend did not respond within timeout')

        print('Waiting for frontend to respond...')
        if wait_for_url(frontend_url, timeout=12):
            print('Frontend is up')
            print('\n==============================')
            print('Frontend is running at: http://localhost:5174')
            print('Open this URL in your browser to access the app.')
            print('==============================\n')
        else:
            print('Warning: frontend did not respond within timeout')

        # Wait for both processes; exit when either exits or on Ctrl+C
        while True:
            for p, name in procs:
                ret = p.poll()
                if ret is not None:
                    print(f"{name} exited with code {ret}")
                    raise SystemExit(0)
            # Sleep a bit
            try:
                if hasattr(signal, 'pause'):
                    signal.pause()
                else:
                    time.sleep(0.5)
            except KeyboardInterrupt:
                print("\nStopping servers...")
                raise
    except KeyboardInterrupt:
        pass
    except SystemExit:
        pass
    except Exception as e:
        print(f"Error launching processes: {e}")
    finally:
        # Terminate children
        for p, name in procs:
            try:
                if p.poll() is None:
                    print(f"Terminating {name}...")
                    p.terminate()
            except Exception:
                pass
        for p, name in procs:
            try:
                p.wait(timeout=5)
            except Exception:
                try:
                    p.kill()
                except Exception:
                    pass

if __name__ == "__main__":
    start_project()