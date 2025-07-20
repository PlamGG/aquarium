from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    CORS(app)  # เปิดใช้งาน CORS สำหรับทุก route

    from app import routes
    app.register_blueprint(routes.bp, url_prefix='/api')

    return app
