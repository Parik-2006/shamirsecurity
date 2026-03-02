# run_all.py
import subprocess
import os

def start_project():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    
    backend_cmd = f'cd /d "{root_dir}\\backend" && python app.py'
    # Force the port to 5174 here
    frontend_cmd = f'cd /d "{root_dir}\\frontend" && npm run dev -- --port 5174'

    print("\n" + "="*30)
    print("   SHAMIR VAULT SYSTEM   ")
    print("="*30)
    print(f"Root: {root_dir}")
    print("Backend API:  http://127.0.0.1:5000")
    print("Frontend URL: http://localhost:5174") # Updated output link
    print("-" * 30)
    
    try:
        command = f'concurrently "{backend_cmd}" "{frontend_cmd}"'
        subprocess.run(command, shell=True)
    except Exception as e:
        print(f"Error: {e}")
    except KeyboardInterrupt:
        print("\nStopping servers...")

if __name__ == "__main__":
    start_project()