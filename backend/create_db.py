import MySQLdb

def create_database():
    try:
        # Connect to MySQL server without specifying a database
        db = MySQLdb.connect(
            host="localhost",
            user="root",
            passwd="Kiran@123"
        )
        
        cursor = db.cursor()
        
        # Create database if it doesn't exist
        cursor.execute("CREATE DATABASE IF NOT EXISTS ai_surge_pricing;")
        print("Database 'ai_surge_pricing' created or already exists!")
        
        db.close()
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    create_database()
