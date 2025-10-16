import os

def replace_in_files(root_dir, old_text, new_text):
    for subdir, _, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith((".html", ".css")):  # check both file types
                file_path = os.path.join(subdir, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                    if old_text in content:
                        content = content.replace(old_text, new_text)
                        with open(file_path, "w", encoding="utf-8") as f:
                            f.write(content)
                        print(f"Updated: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    replace_in_files(".", "ca7d/@main", "ca7d/9326265e4f1b14345a3bdab6f8ffad0e2e7ab3fda920c5f0f095f77359af00aeae22591c5bc4914c84c13d99eb62091d7ce6@main")
