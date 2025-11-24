import sys
import json
import os
import shutil
import re
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
                             QListWidget, QLabel, QLineEdit, QTextEdit, QPushButton, 
                             QScrollArea, QFileDialog, QMessageBox, QFormLayout, QFrame, QCheckBox, QStackedWidget)
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont, QColor, QPalette

# Configuration
DATA_FILE = "src/data/projects.json"
CV_FILE = "src/data/cv.json"
ASSET_BASE_DIR = "public/asset/WebIndependence"
WINDOW_TITLE = "Portfolio Content Manager"
WINDOW_SIZE = (1200, 900)

# Define the standard tags that match the website categories
STANDARD_TAGS = [
    "Interactive/Tech",
    "Film/Video",
    "Sound/Music",
    "Publication/Project"
]

# Legacy mapping for migration (based on the previous hardcoded IDs)
LEGACY_MAPPING = {
    "Interactive/Tech": ['p8', 'p9', 'p10', 'p11', 'p14'],
    "Film/Video": ['p0', 'p1', 'p6', 'p7'],
    "Sound/Music": ['p4', 'p5', 'p12'],
    "Publication/Project": ['p13', 'p15']
}

class PortfolioManager(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle(WINDOW_TITLE)
        self.resize(*WINDOW_SIZE)
        
        # Data
        self.projects = []
        self.cv_content = ""
        self.current_project_index = None

        # Setup UI
        self.setup_ui()
        self.apply_dark_theme()
        
        # Load Data
        self.load_data()
        self.load_cv_data()

    def setup_ui(self):
        # Main Layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QHBoxLayout(central_widget)

        # Sidebar (Project List)
        sidebar_layout = QVBoxLayout()
        
        title_label = QLabel("Projects")
        title_label.setFont(QFont("Arial", 16, QFont.Weight.Bold))
        sidebar_layout.addWidget(title_label)

        self.add_btn = QPushButton("Add New Project")
        self.add_btn.clicked.connect(self.add_new_project)
        sidebar_layout.addWidget(self.add_btn)

        self.project_list = QListWidget()
        self.project_list.currentRowChanged.connect(self.load_project)
        sidebar_layout.addWidget(self.project_list)

        self.save_btn = QPushButton("Save All Changes")
        self.save_btn.setStyleSheet("background-color: #2E8B57; color: white; font-weight: bold; padding: 10px;")
        self.save_btn.clicked.connect(self.save_data)
        sidebar_layout.addWidget(self.save_btn)

        self.cv_btn = QPushButton("Edit CV")
        self.cv_btn.setStyleSheet("background-color: #4682B4; color: white; font-weight: bold; padding: 10px; margin-top: 10px;")
        self.cv_btn.clicked.connect(self.show_cv_editor)
        sidebar_layout.addWidget(self.cv_btn)

        # Sidebar Container
        sidebar_widget = QWidget()
        sidebar_widget.setLayout(sidebar_layout)
        sidebar_widget.setFixedWidth(300)
        main_layout.addWidget(sidebar_widget)

        # Editor Area (Scrollable)
        scroll_area = QScrollArea()
        scroll_area.setWidgetResizable(True)
        scroll_area.setFrameShape(QFrame.Shape.NoFrame)
        
        self.editor_widget = QWidget()
        self.editor_layout = QVBoxLayout(self.editor_widget)
        self.editor_layout.setAlignment(Qt.AlignmentFlag.AlignTop)

        # Form Fields
        self.fields = {}
        form_layout = QFormLayout()
        form_layout.setLabelAlignment(Qt.AlignmentFlag.AlignLeft)
        
        labels = ["ID", "Title", "Year", "Category (Display Text)", "Youtube URL"]
        for label in labels:
            key = label.lower().replace(" ", "").replace("(displaytext)", "")
            if label == "Youtube URL": key = "youtubeUrl"
            
            line_edit = QLineEdit()
            form_layout.addRow(QLabel(label + ":"), line_edit)
            self.fields[key] = line_edit

        self.editor_layout.addLayout(form_layout)

        # Tag Selection (Checkboxes)
        self.editor_layout.addSpacing(10)
        self.editor_layout.addWidget(QLabel("Website Categories (Tags):"))
        
        self.tag_checkboxes = {}
        tags_layout = QVBoxLayout()
        for tag in STANDARD_TAGS:
            cb = QCheckBox(tag)
            self.tag_checkboxes[tag] = cb
            tags_layout.addWidget(cb)
        
        self.editor_layout.addLayout(tags_layout)

        # Description
        self.editor_layout.addSpacing(10)
        self.editor_layout.addWidget(QLabel("Description:"))
        self.desc_edit = QTextEdit()
        self.desc_edit.setMinimumHeight(150)
        self.editor_layout.addWidget(self.desc_edit)

        # Image Management
        self.editor_layout.addSpacing(20)
        img_header = QLabel("Image Management")
        img_header.setFont(QFont("Arial", 14, QFont.Weight.Bold))
        self.editor_layout.addWidget(img_header)

        self.add_img_btn = QPushButton("Add Image from Computer")
        self.add_img_btn.clicked.connect(self.add_image)
        self.editor_layout.addWidget(self.add_img_btn)

        self.editor_layout.addWidget(QLabel("Current Images (Paths):"))
        self.image_list_edit = QTextEdit()
        self.image_list_edit.setPlaceholderText("One path per line...")
        self.image_list_edit.setMinimumHeight(100)
        self.editor_layout.addWidget(self.image_list_edit)

        self.editor_layout.addWidget(QLabel("Thumbnail Path:"))
        self.thumb_edit = QLineEdit()
        self.editor_layout.addWidget(self.thumb_edit)

        scroll_area.setWidget(self.editor_widget)
        
        # CV Editor Area
        self.cv_editor_widget = QWidget()
        cv_layout = QVBoxLayout(self.cv_editor_widget)
        
        cv_label = QLabel("CV Editor (Markdown Supported)")
        cv_label.setFont(QFont("Arial", 14, QFont.Weight.Bold))
        cv_layout.addWidget(cv_label)
        
        self.cv_edit = QTextEdit()
        self.cv_edit.setFont(QFont("Consolas", 12))
        cv_layout.addWidget(self.cv_edit)
        
        save_cv_btn = QPushButton("Save CV")
        save_cv_btn.setStyleSheet("background-color: #2E8B57; color: white; font-weight: bold; padding: 10px;")
        save_cv_btn.clicked.connect(self.save_cv_data)
        cv_layout.addWidget(save_cv_btn)

        # Stacked Widget to switch between Project Editor and CV Editor
        self.stack = QStackedWidget()
        self.stack.addWidget(scroll_area)      # Index 0: Project Editor
        self.stack.addWidget(self.cv_editor_widget) # Index 1: CV Editor
        
        main_layout.addWidget(self.stack)

    def apply_dark_theme(self):
        palette = QPalette()
        palette.setColor(QPalette.ColorRole.Window, QColor(53, 53, 53))
        palette.setColor(QPalette.ColorRole.WindowText, Qt.GlobalColor.white)
        palette.setColor(QPalette.ColorRole.Base, QColor(25, 25, 25))
        palette.setColor(QPalette.ColorRole.AlternateBase, QColor(53, 53, 53))
        palette.setColor(QPalette.ColorRole.ToolTipBase, Qt.GlobalColor.white)
        palette.setColor(QPalette.ColorRole.ToolTipText, Qt.GlobalColor.white)
        palette.setColor(QPalette.ColorRole.Text, Qt.GlobalColor.white)
        palette.setColor(QPalette.ColorRole.Button, QColor(53, 53, 53))
        palette.setColor(QPalette.ColorRole.ButtonText, Qt.GlobalColor.white)
        palette.setColor(QPalette.ColorRole.BrightText, Qt.GlobalColor.red)
        palette.setColor(QPalette.ColorRole.Link, QColor(42, 130, 218))
        palette.setColor(QPalette.ColorRole.Highlight, QColor(42, 130, 218))
        palette.setColor(QPalette.ColorRole.HighlightedText, Qt.GlobalColor.black)
        QApplication.setPalette(palette)

    def load_data(self):
        if not os.path.exists(DATA_FILE):
            QMessageBox.critical(self, "Error", f"Data file not found: {DATA_FILE}")
            return

        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                self.projects = json.load(f)
            
            self.migrate_data()
            self.refresh_project_list()
            
            if self.projects:
                self.project_list.setCurrentRow(0)
                
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to load data: {str(e)}")

    def load_cv_data(self):
        if not os.path.exists(CV_FILE):
            # Create default if not exists
            default_cv = {"content": "### New CV\n\nStart editing..."}
            try:
                with open(CV_FILE, 'w', encoding='utf-8') as f:
                    json.dump(default_cv, f, indent=4)
                self.cv_content = default_cv["content"]
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Failed to create CV file: {str(e)}")
                return
        else:
            try:
                with open(CV_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.cv_content = data.get("content", "")
            except Exception as e:
                QMessageBox.critical(self, "Error", f"Failed to load CV data: {str(e)}")
        
        self.cv_edit.setPlainText(self.cv_content)

    def migrate_data(self):
        modified = False
        url_pattern = re.compile(r'(https?://(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)[^\s]+)')
        
        for project in self.projects:
            # 1. Migrate Youtube URLs
            if 'youtubeUrl' not in project or not project['youtubeUrl']:
                description = project.get('description', '')
                match = url_pattern.search(description)
                if match:
                    url = match.group(0)
                    project['youtubeUrl'] = url
                    new_desc = description.replace(url, '').strip()
                    new_desc = re.sub(r'\n{3,}', '\n\n', new_desc)
                    project['description'] = new_desc
                    modified = True
            
            # 2. Migrate Tags (One-time, based on ID)
            if 'tags' not in project:
                project['tags'] = []
                pid = project.get('id')
                for tag, ids in LEGACY_MAPPING.items():
                    if pid in ids:
                        project['tags'].append(tag)
                modified = True
        
        if modified:
            print("Migrated Data (YouTube URLs and Tags).")

    def refresh_project_list(self):
        self.project_list.clear()
        for project in self.projects:
            self.project_list.addItem(project.get('title', 'Untitled'))

    def load_project(self, index):
        if index < 0 or index >= len(self.projects):
            return
            
        if self.current_project_index is not None and self.current_project_index != index:
            self.save_current_project_state_to_memory()

        self.current_project_index = index
        self.stack.setCurrentIndex(0) # Switch to Project Editor view
        project = self.projects[index]

        self.fields['id'].setText(project.get('id', ''))
        self.fields['title'].setText(project.get('title', ''))
        self.fields['year'].setText(project.get('year', ''))
        self.fields['category'].setText(project.get('category', ''))
        self.fields['youtubeUrl'].setText(project.get('youtubeUrl', ''))
        
        # Tags
        current_tags = project.get('tags', [])
        for tag, cb in self.tag_checkboxes.items():
            cb.setChecked(tag in current_tags)

        self.desc_edit.setPlainText(project.get('description', ''))
        
        images = project.get('images', [])
        self.image_list_edit.setPlainText("\n".join(images))
        
        self.thumb_edit.setText(project.get('thumbnail', ''))

    def save_current_project_state_to_memory(self):
        if self.current_project_index is None:
            return

        project = self.projects[self.current_project_index]
        project['id'] = self.fields['id'].text()
        project['title'] = self.fields['title'].text()
        project['year'] = self.fields['year'].text()
        project['category'] = self.fields['category'].text()
        project['youtubeUrl'] = self.fields['youtubeUrl'].text()
        
        # Save Tags
        selected_tags = []
        for tag, cb in self.tag_checkboxes.items():
            if cb.isChecked():
                selected_tags.append(tag)
        project['tags'] = selected_tags

        project['description'] = self.desc_edit.toPlainText().strip()
        project['thumbnail'] = self.thumb_edit.text()
        
        img_text = self.image_list_edit.toPlainText().strip()
        project['images'] = [line.strip() for line in img_text.split('\n') if line.strip()]

    def add_new_project(self):
        new_id = f"p{len(self.projects)}"
        new_project = {
            "id": new_id,
            "title": "New Project",
            "year": "2025",
            "category": "New",
            "thumbnail": "",
            "images": [],
            "description": "",
            "youtubeUrl": "",
            "tags": []
        }
        self.projects.append(new_project)
        self.refresh_project_list()
        self.project_list.setCurrentRow(len(self.projects) - 1)

    def add_image(self):
        if self.current_project_index is None:
            QMessageBox.warning(self, "Warning", "Please select a project first.")
            return

        file_paths, _ = QFileDialog.getOpenFileNames(
            self, "Select Images", "", "Image Files (*.png *.jpg *.jpeg *.gif *.webp)"
        )

        if not file_paths:
            return

        project_title = self.fields['title'].text().strip()
        safe_title = "".join([c for c in project_title if c.isalpha() or c.isdigit() or c in (' ', '-', '_')]).strip()
        if not safe_title:
            safe_title = "Untitled_Project"

        target_dir = os.path.join(ASSET_BASE_DIR, safe_title)
        os.makedirs(target_dir, exist_ok=True)

        new_images = []
        for file_path in file_paths:
            filename = os.path.basename(file_path)
            target_path = os.path.join(target_dir, filename)
            
            try:
                shutil.copy2(file_path, target_path)
                rel_path = os.path.join("asset/WebIndependence", safe_title, filename)
                new_images.append(rel_path)
            except Exception as e:
                QMessageBox.warning(self, "Error", f"Failed to copy {filename}: {e}")

        # Update UI
        current_text = self.image_list_edit.toPlainText().strip()
        if current_text:
            updated_text = current_text + "\n" + "\n".join(new_images)
        else:
            updated_text = "\n".join(new_images)
            
        self.image_list_edit.setPlainText(updated_text)
        
        # Auto-set thumbnail if empty
        if not self.thumb_edit.text().strip() and new_images:
            self.thumb_edit.setText(new_images[0])

    def save_data(self):
        self.save_current_project_state_to_memory()
        
        try:
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.projects, f, indent=4, ensure_ascii=False)
            QMessageBox.information(self, "Success", "Data saved successfully!")
            
            # Refresh list title in case it changed
            curr_row = self.project_list.currentRow()
            self.refresh_project_list()
            self.project_list.setCurrentRow(curr_row)
            
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to save data: {str(e)}")

    def show_cv_editor(self):
        self.project_list.clearSelection()
        self.current_project_index = None # Deselect project
        self.stack.setCurrentIndex(1) # Switch to CV Editor view

    def save_cv_data(self):
        content = self.cv_edit.toPlainText()
        try:
            with open(CV_FILE, 'w', encoding='utf-8') as f:
                json.dump({"content": content}, f, indent=4, ensure_ascii=False)
            QMessageBox.information(self, "Success", "CV saved successfully!")
            self.cv_content = content
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to save CV: {str(e)}")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = PortfolioManager()
    window.show()
    sys.exit(app.exec())
