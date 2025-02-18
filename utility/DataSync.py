import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import requests
from tkcalendar import DateEntry
import json
import sqlite3
import PySimpleGUI as sg
import xml.etree.ElementTree as ET
import os
import shutil
import sys
import babel.numbers
import certifi
import pandas as pd
from tkinterdnd2 import TkinterDnD  # Import TkinterDnD
from tkcalendar import DateEntry
from tkcalendar import Calendar
from datetime import datetime,timedelta  # Import the datetime class from the datetime module
from fpdf import FPDF

# Get the directory where the executable is located
if getattr(sys, 'frozen', False):  # Check if the script is compiled
    executable_directory = os.path.dirname(sys.executable)
else:
    executable_directory = os.path.dirname(os.path.abspath(__file__))

# Define the fixed part of the path
fixed_part = "lib\site-packages\certifi\cacert.pem"

# Create the complete path by joining the executable directory and the fixed part
certificate_bundle_path = os.path.join(executable_directory, fixed_part)

print(certificate_bundle_path)

# Function that uses the global variables
def get_complete_path():
    global certificate_bundle_path
    return certificate_bundle_path

# Define the API URL, SQL query, and headers
Stock_api_url = "http://localhost:981/"
sql_query = "select A.Code as ItemCode,A.Name as itemname, A.Alias,A.D16 as Discount, STRING_AGG(B.cm1, ';') as Itemcategorycode,STRING_AGG(C.name, ';') as Itemcategory,D.name as StockGroupname,A.d3 As SalePrice, A.D1 as ConversionFactor,A.I9 as ConversionType,E.OF3 as points from master1 A inner join MasterSupport B on A.Code = B.MasterCode inner join Master1 C on B.CM1 = C.Code inner join Master1 D on A.ParentGrp=D.Code inner join MasterAddressInfo E on E.MasterCode=A.Code where A.MasterType = 6 and B.RecType = 110 group by A.Code, a.name,A.Alias, A.D16, D.name,A.d3,A.d1,a.i9,E.OF3;"
Stock_api_headers = {
    "SC": "1",
    "Qry": sql_query,
    "UserName": "fawz",
    "Pwd": "fawz@52"
}


# Function to create the stock_items table
def create_stock_items_table(cursor):
    try:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS stock_items (
                ItemCode TEXT UNIQUE,
                itemname TEXT,
                Alias TEXT,
                Discount REAL,
                Itemcategorycode TEXT,
                Itemcategory TEXT,
                StockGroupname TEXT,
                SalePrice INTEGER,
                ConversionFactor INTEGER,
                ConversionType,
                points INTEGER
            )
        """)
        print("Stock items table created successfully.")
    except Exception as e:
        print(f"Error creating stock_items table: {e}")

# Function to fetch and store stock items data
def fetch_and_store_stock_items(conn, cursor):
    try:
        # Make the API request to your local API
        local_response = requests.post(Stock_api_url, headers=Stock_api_headers)

        # Check the response status code
        if local_response.status_code == 200:
            # Print the API response
            api_response = local_response.text
            print(f"API Response: {api_response}")

            # Parse the XML response
            root = ET.fromstring(api_response)

            
            # Extract data from the XML and insert it into the SQLite database
            create_stock_items_table(cursor)

            # Delete existing data from the 'stock_items' table
            cursor.execute("DELETE FROM stock_items")

            for row in root.findall(".//z:row", namespaces={"z": "#RowsetSchema"}):
                item_code = row.get("ItemCode")
                itemname=   row.get("itemname")
                Alias = row.get("Alias")
                discount = row.get("Discount")
                Itemcategorycode = row.get("Itemcategorycode")
                Itemcategory = row.get ("Itemcategory")
                StockGroupname = row.get ("StockGroupname")
                SalePrice= row.get ("SalePrice")
                ConversionFactor= row.get("ConversionFactor")
                ConversionType= row.get("ConversionType")
                points= row.get("points")
            
                cursor.execute("""
                    INSERT INTO stock_items (ItemCode, itemname, Alias, Discount, Itemcategorycode, Itemcategory, StockGroupname, SalePrice,ConversionFactor, ConversionType, points)
                    VALUES (?, ? ,?, ?, ?, ?, ?, ?, ?, ? , ?)
                """, (item_code, itemname, Alias, discount, Itemcategorycode, Itemcategory, StockGroupname, SalePrice, ConversionFactor, ConversionType, points))

            # Commit the changes
            conn.commit()
            print("Stock items data fetched and stored successfully!")

        else:
            print(f"Local API request failed with status code {local_response.status_code}")

    except Exception as e:
        print(f"An error occurred while fetching and storing stock items data: {e}")

def fetch_sales_type():
    sales_type_api_url = "http://localhost:981/"
    sales_type_headers = {
        "SC": "1",
        "Qry": "select code,name from Master1 where B5=1",
        "UserName": "fawz",
        "Pwd": "fawz@52"
    }

    try:
        response = requests.get(sales_type_api_url, headers=sales_type_headers)
        response.raise_for_status()  # Raise an exception for non-200 status codes

        # Parse the XML response
        root = ET.fromstring(response.content)
        print("API response parsed successfully.")  # Debugging print

        with sqlite3.connect('local_db.db') as conn:
            cursor = conn.cursor()                        
            # Delete existing data from the 'sales_type' table
            cursor.execute("DELETE FROM sales_type")
            
            for row in root.findall('.//z:row', namespaces={'z': '#RowsetSchema'}):
                code = row.get("code")  # Ensure the attribute name matches the XML
                name = row.get("name")  # Ensure the attribute name matches the XML                

                if code and name:  # Ensure both code and name are not None
                    cursor.execute("INSERT OR IGNORE INTO sales_type (code, name) VALUES (?, ?)", (code, name))

            conn.commit()  # Ensure the changes are committed

        print("Sales type data updated successfully.")

    except requests.RequestException as e:
        print("Failed to retrieve data from the API:", e)
        # Optionally, inform the user about the failure

    except sqlite3.Error as e:
        print("An error occurred while updating the database:", e)
        # Optionally, inform the user about the failure

    except ET.ParseError as e:
        print("Failed to parse the XML response:", e)
        # Optionally, inform the user about the failure

    except Exception as e:
        print("An unexpected error occurred:", e)
        # Optionally, inform the user about the failure
    
    

# Function to handle the submission
def submit():
    username = entry2.get()
    password = entry3.get()


    if username == "taher" and password == "taher":
        # Connect to the SQLite database
        conn = sqlite3.connect('local_db.db')
        cursor = conn.cursor()

        # Call the function to fetch and store stock items data
        fetch_and_store_stock_items(conn, cursor)
        
        # Call the function to fetch and store account ledger sales data
        fetch_account_ledger_Sales()

        # Call the function to fetch and store sales_types data
        fetch_sales_type()

        # Close the database connection
        conn.close()

        # Show the sub screen or perform other actions as needed
        show_sub_screen()
    else:
        result_label.config(text="Invalid Username or Password")
        
def show_sub_screen():
    sub_window = tk.Toplevel(main_window)
    sub_window.title("Sub-Screen")

    # Set the size of the sub-screen to 1500x800
    sub_window.geometry("1500x800")

    sub_label = tk.Label(sub_window, text="Welcome to the Sub-Screen!")
    sub_label.pack(padx=20, pady=20)

    # Create a menu bar for the sub-screen
    sub_menu_bar = tk.Menu(sub_window)
    sub_window.config(menu=sub_menu_bar)

    # Create the Sale Order menu in the sub-screen
    sale_order_menu = tk.Menu(sub_menu_bar, tearoff=0)
    sub_menu_bar.add_cascade(label="Sale Order", menu=sale_order_menu)

    # Create the Stock Updation menu in the sub-screen
    stock_updation_menu = tk.Menu(sub_menu_bar, tearoff=0)
    sub_menu_bar.add_cascade(label="Stock Updation", menu=stock_updation_menu)

    # Create a sub-menu under Sale Order for Fetch Sale Order
    fetch_sale_order_menu = tk.Menu(sale_order_menu, tearoff=0)
    sale_order_menu.add_cascade(label="Feed Sale Order", menu=fetch_sale_order_menu)
    fetch_sale_order_menu.add_command(label="Create Sale order", command=create_sale_order)

    # Create a sub-menu under Stock Updation for Fetch Stock
    fetch_stock_menu = tk.Menu(stock_updation_menu, tearoff=0)
    stock_updation_menu.add_cascade(label="Fetch Stock", menu=fetch_stock_menu)

    # Add an option to update stock with a command to open the update_stock window
    fetch_stock_menu.add_command(label="Update Stock", command=update_stock)
    
    # Create the Sales Updation menu in the sub-screen
    sale_updation_menu = tk.Menu(sub_menu_bar, tearoff=0)
    sub_menu_bar.add_cascade(label="Sales", menu=sale_updation_menu)

    # Create a sub-menu under Sale Order for Fetch Sale Order
    fetch_sale_updation_menu = tk.Menu(sale_updation_menu, tearoff=0)
    sale_updation_menu.add_cascade(label="Feed Sales invoice", menu=fetch_sale_updation_menu)
    fetch_sale_updation_menu.add_command(label="Create Sale invoice", command=create_sale_invoice)
    
    # Create the Customer Updation menu in the sub-menu
    Customer_updation_menu = tk.Menu(sub_menu_bar, tearoff=0)
    sub_menu_bar.add_cascade(label="Customer", menu=Customer_updation_menu)

    # Create a sub-menu under Customer for Fetch Customer Updation
    fetch_Customer_updation_menu = tk.Menu(Customer_updation_menu, tearoff=0)
    Customer_updation_menu.add_cascade(label="Feed Customer", menu=fetch_Customer_updation_menu)    
    fetch_Customer_updation_menu.add_command(label="Update customer", command=update_customer)

def update_customer():
    ag_api_url = "http://localhost:981/"
    ag_headers = {
        "SC": "1",
        "Qry": "SELECT code, name FROM master1 WHERE parentgrp=116",
        "UserName": "fawz",
        "Pwd": "fawz@52"
    }

    try:
        response = requests.get(ag_api_url, headers=ag_headers)
        response.raise_for_status()  # Raise an exception for non-200 status codes

        # Parse the XML response
        root = ET.fromstring(response.content)
        print("API response parsed successfully.")  # Debugging print

        with sqlite3.connect('local_db.db') as conn:
            cursor = conn.cursor()
            
            cursor.execute('''CREATE TABLE IF NOT EXISTS AccountGrp (
                             code TEXT PRIMARY KEY,
                             name TEXT
                             )''')
            # Delete existing data from the 'Account Group' table
            cursor.execute("DELETE FROM AccountGrp")
            
            for row in root.findall('.//z:row', namespaces={'z': '#RowsetSchema'}):
                code = row.get("code")  # Ensure the attribute name matches the XML
                name = row.get("name")  # Ensure the attribute name matches the XML                

                if code and name:  # Ensure both code and name are not None
                    cursor.execute("INSERT OR IGNORE INTO AccountGrp (code, name) VALUES (?, ?)", (code, name))

            conn.commit()  # Ensure the changes are committed

        print("Customer data updated successfully.")
        fetch_account_ledger()

    except requests.RequestException as e:
        print("Failed to retrieve data from the API:", e)
        # Optionally, inform the user about the failure

    except sqlite3.Error as e:
        print("An error occurred while updating the database:", e)
        # Optionally, inform the user about the failure

    except ET.ParseError as e:
        print("Failed to parse the XML response:", e)
        # Optionally, inform the user about the failure

    except Exception as e:
        print("An unexpected error occurred:", e)
        # Optionally, inform the user about the failure

def fetch_account_ledger():
    try:
        print("Fetching account ledger data...")
        # Connect to the local database and fetch codes from AccountGrp table
        with sqlite3.connect('local_db.db') as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT code FROM AccountGrp")
            codes = cursor.fetchall()

        # Check if any codes were retrieved
        if not codes:
            print("No codes found in the AccountGrp table.")
            return
        

        # Set up the API headers
        am_api_url = "http://localhost:981/"
        am_headers = {
            "SC": "1",
            "Qry": "select code,name,parentgrp from master1 where mastertype=2",
            "UserName": "fawz",
            "Pwd": "fawz@52"
        }

        # Make the API request
        response = requests.get(am_api_url, headers=am_headers)
        response.raise_for_status()  # Raise an exception for non-200 status codes

        # Parse the XML response
        root = ET.fromstring(response.content)
        print("API response parsed successfully.")  # Debugging print

        # Process and store the ledger data as needed
        with sqlite3.connect('local_db.db') as conn:
            cursor = conn.cursor()            

            cursor.execute('''CREATE TABLE IF NOT EXISTS AccountLedger (
                            code TEXT PRIMARY KEY,
                            name TEXT,
                            parentgrp Text
                             )''')

            # Delete existing data from the 'Account Ledger' table
            cursor.execute("DELETE FROM AccountLedger")

            for row in root.findall('.//z:row', namespaces={'z': '#RowsetSchema'}):
                code = row.get("code")  # Ensure the attribute name matches the XML                
                name = row.get("name")  # Ensure the attribute name matches the XML
                parentgrp = row.get("parentgrp")  # Ensure the attribute name matches the XML                
                if name:  # Ensure name is not None
                    cursor.execute("INSERT OR IGNORE INTO AccountLedger (code,name,parentgrp) VALUES (?, ?, ?)", (code,name,parentgrp))

            conn.commit()  # Ensure the changes are committed
            fetch_Bill_sundry()

        print("Account ledger data updated successfully.")

    except requests.RequestException as e:
        print("Failed to retrieve data from the API:", e)
        # Optionally, inform the user about the failure

    except sqlite3.Error as e:
        print("An error occurred while updating the database:", e)
        # Optionally, inform the user about the failure

    except ET.ParseError as e:
        print("Failed to parse the XML response:", e)
        # Optionally, inform the user about the failure

    except Exception as e:
        print("An unexpected error occurred:", e)
        # Optionally, inform the user about the failure

def fetch_account_ledger_Sales():
    try:
        print("Fetching account ledger data...")
        # Connect to the local database and fetch codes from AccountGrp table
        with sqlite3.connect('local_db.db') as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT code FROM AccountGrp")
            codes = cursor.fetchall()

        # Check if any codes were retrieved
        if not codes:
            print("No codes found in the AccountGrp table.")
            return
        

        # Set up the API headers
        am_api_url = "http://localhost:981/"
        am_headers = {
            "SC": "1",
            "Qry": "select code,name,parentgrp from master1 where mastertype=2",
            "UserName": "fawz",
            "Pwd": "fawz@52"
        }

        # Make the API request
        response = requests.get(am_api_url, headers=am_headers)
        response.raise_for_status()  # Raise an exception for non-200 status codes

        # Parse the XML response
        root = ET.fromstring(response.content)
        print("API response parsed successfully.")  # Debugging print

        # Process and store the ledger data as needed
        with sqlite3.connect('local_db.db') as conn:
            cursor = conn.cursor()            

            cursor.execute('''CREATE TABLE IF NOT EXISTS AccountLedger (
                            code TEXT PRIMARY KEY,
                            name TEXT,
                            parentgrp Text
                             )''')

            # Delete existing data from the 'Account Ledger' table
            cursor.execute("DELETE FROM AccountLedger")

            for row in root.findall('.//z:row', namespaces={'z': '#RowsetSchema'}):
                code = row.get("code")  # Ensure the attribute name matches the XML                
                name = row.get("name")  # Ensure the attribute name matches the XML
                parentgrp = row.get("parentgrp")  # Ensure the attribute name matches the XML                
                if name:  # Ensure name is not None
                    cursor.execute("INSERT OR IGNORE INTO AccountLedger (code,name,parentgrp) VALUES (?, ?, ?)", (code,name,parentgrp))

            conn.commit()  # Ensure the changes are committed            

        print("Account ledger data updated successfully.")

    except requests.RequestException as e:
        print("Failed to retrieve data from the API:", e)
        # Optionally, inform the user about the failure

    except sqlite3.Error as e:
        print("An error occurred while updating the database:", e)
        # Optionally, inform the user about the failure

    except ET.ParseError as e:
        print("Failed to parse the XML response:", e)
        # Optionally, inform the user about the failure

    except Exception as e:
        print("An unexpected error occurred:", e)
        # Optionally, inform the user about the failure

def fetch_Bill_sundry():
    try:
        # Set up the API headers
        am_api_url = "http://localhost:981/"
        am_headers = {
            "SC": "1",
            "Qry": "select Code,Name from master1 where MasterType=9",
            "UserName": "fawz",
            "Pwd": "fawz@52"
        }

        # Make the API request
        response = requests.get(am_api_url, headers=am_headers)
        response.raise_for_status()  # Raise an exception for non-200 status codes

        # Parse the XML response
        root = ET.fromstring(response.content)
        print("API response parsed successfully.")  # Debugging print

        # Process and store the ledger data as needed
        with sqlite3.connect('local_db.db') as conn:
            cursor = conn.cursor()
            

            cursor.execute('''CREATE TABLE IF NOT EXISTS BillSundry(
                            Code TEXT PRIMARY KEY,
                            Name TEXT                            
                             )''')

            for row in root.findall('.//z:row', namespaces={'z': '#RowsetSchema'}):
                code = row.get("Code")  # Ensure the attribute name matches the XML                
                name = row.get("Name")  # Ensure the attribute name matches the XML                
                if name:  # Ensure name is not None
                    cursor.execute("INSERT OR IGNORE INTO BillSundry (code,name) VALUES (?, ?)", (code,name))

            conn.commit()  # Ensure the changes are committed
            show_customer_price_mapping()

        print("Bill Sundry data updated successfully.")

    except requests.RequestException as e:
        print("Failed to retrieve data from the API:", e)
        # Optionally, inform the user about the failure

    except sqlite3.Error as e:
        print("An error occurred while updating the database:", e)
        # Optionally, inform the user about the failure

    except ET.ParseError as e:
        print("Failed to parse the XML response:", e)
        # Optionally, inform the user about the failure

    except Exception as e:
        print("An unexpected error occurred:", e)
        # Optionally, inform the user about the failure


# Function to fetch customer names from the database
def fetch_customer_names():
    conn = sqlite3.connect('local_db.db')
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT name FROM Accountledger")       
    customers = [row[0] for row in cursor.fetchall()]
    conn.close()
    return customers

# Function to fetch item names from the database
def fetch_item_names():
    conn = sqlite3.connect('local_db.db')
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT alias FROM stock_items")
    items = [row[0] for row in cursor.fetchall()]
    conn.close()
    return items

# Function to fetch item groups from the database
def fetch_item_groups():
    conn = sqlite3.connect('local_db.db')
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT StockGroupname FROM stock_items")
    groups = [row[0] for row in cursor.fetchall()]
    conn.close()
    return groups

# Function to fetch bill sundries from the database
def fetch_bill_sundries():
    conn = sqlite3.connect('local_db.db')
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT Name FROM BillSundry")
    sundries = [row[0] for row in cursor.fetchall()]
    conn.close()
    return sundries

# Function to fetch item group based on item name
def fetch_item_group(item_name):
    conn = sqlite3.connect('local_db.db')
    cursor = conn.cursor()
    cursor.execute("SELECT StockGroupname FROM stock_items WHERE alias = ?", (item_name,))
    item_group = cursor.fetchone()
    conn.close()
    return item_group[0] if item_group else None

def fetch_item_names_by_group(item_group):
    conn = sqlite3.connect('local_db.db')
    cursor = conn.cursor()
    cursor.execute("SELECT alias FROM stock_items WHERE StockGroupname = ?", (item_group,))
    item_names = [row[0] for row in cursor.fetchall()]
    conn.close()
    return item_names

def create_common_table():
    conn = sqlite3.connect('local_db.db')
    cursor = conn.cursor()
    create_table_query = """
        CREATE TABLE IF NOT EXISTS Customer_price_info (
            [Customer name] TEXT,
            [Item Name] TEXT,
            [Item group] TEXT,
            [Bill Sundry] TEXT, 
            [ItemDiscount1] REAL,
            [ItemDiscount2] REAL,
            [ItemDiscount3] REAL,
            [itemgroupDiscount1] REAL,
            [itemgroupDiscount2] REAL,
            [itemgroupDiscount3] REAL,
            Comment TEXT,
            created_at DATETIME,
            updated_at DATETIME,
            logremarks TEXT
        )
    """
    cursor.execute(create_table_query)
    conn.commit()
    conn.close()

def copy_records_to_new_customer(old_customer, new_customer):
    conn = sqlite3.connect('local_db.db')
    cursor = conn.cursor()
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    try:
        cursor.execute("""
            INSERT INTO Customer_price_info
            ([Customer name], [Item Name], [Item group], [Bill Sundry], ItemDiscount1, ItemDiscount2, ItemDiscount3, itemgroupDiscount1, itemgroupDiscount2, itemgroupDiscount3, Comment, created_at, updated_at, logremarks)
            SELECT ?, [Item Name], [Item group], [Bill Sundry], ItemDiscount1, ItemDiscount2, ItemDiscount3, itemgroupDiscount1, itemgroupDiscount2, itemgroupDiscount3, Comment, ?, ?, ?
            FROM Customer_price_info
            WHERE [Customer name] = ?
        """, (new_customer, current_time, current_time, f"[{current_time}] Copied from {old_customer}", old_customer))
        
        conn.commit()
        print(f"Records copied from {old_customer} to {new_customer}.")
    except sqlite3.Error as e:
        print(f"An error occurred while copying records: {e}")
    finally:
        conn.close()

def fetch_records_from_main_table(customer):
    conn = sqlite3.connect('local_db.db')
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT [Customer name], [Item Name], [Item group], [Bill Sundry], ItemDiscount1, ItemDiscount2, ItemDiscount3,itemgroupDiscount1,itemgroupDiscount2,itemgroupDiscount3,Comment
        FROM Customer_price_info
        WHERE [Customer name] = ?
    """, (customer,))
    records = cursor.fetchall()
    conn.close()
    return records


def save_or_update_record_to_main_table(record):
    conn = sqlite3.connect('local_db.db')
    cursor = conn.cursor()
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    try:
        # Check if Item Name is blank or NULL
        if not record[1]:
            # Item Name is blank or NULL, perform operations based on Item Group

            # Check if the record exists based on Customer name and Item group with blank or NULL Item name
            query_select_group = """
                SELECT COUNT(*), *
                FROM Customer_price_info
                WHERE [Customer name] = ? AND [Item group] = ? AND ([Item Name] IS NULL OR [Item Name] = '')
            """
            select_values_group = (record[0], record[2])  # Customer name, Item group

            cursor.execute(query_select_group, select_values_group)
            result = cursor.fetchone()
            exists_group = result[0] > 0

            if exists_group:
                # Get existing record for logremarks
                existing_record = result[1:]
                existing_log = existing_record[-1] if existing_record[-1] else ""

                # Update the record if it exists
                query_update_group = """
                    UPDATE Customer_price_info
                    SET itemgroupDiscount1 = COALESCE(?, 0.0), itemgroupDiscount2 = COALESCE(?, 0.0), itemgroupDiscount3 = COALESCE(?, 0.0), 
                        ItemDiscount1 = 0.0, ItemDiscount2 = 0.0, ItemDiscount3 = 0.0,
                        Comment = ?,
                        updated_at = ?,
                        logremarks = ?
                    WHERE [Customer name] = ? AND [Item group] = ? AND ([Item Name] IS NULL OR [Item Name] = '')
                """
                update_values_group = (
                    record[4], record[5], record[6], record[10], current_time, 
                    f"{existing_log.strip()}[{current_time}] Updated from {existing_record} to {tuple(record)}", 
                    record[0], record[2]
                )

                cursor.execute(query_update_group, update_values_group)
            else:
                # Insert a new record if it does not exist
                query_insert_group = """
                    INSERT INTO Customer_price_info
                    ([Customer name], [Item Name], [Item group], [Bill Sundry], 
                     itemgroupDiscount1, itemgroupDiscount2, itemgroupDiscount3, 
                     ItemDiscount1, ItemDiscount2, ItemDiscount3,
                     Comment, created_at, updated_at, logremarks)
                    VALUES (?, ?, ?, ?, COALESCE(?, 0.0), COALESCE(?, 0.0), COALESCE(?, 0.0), 0.0, 0.0, 0.0, ?, ?, ?, ?)
                """
                insert_values_group = (
                    record[0], '', record[2], record[3], record[4], record[5], record[6], 
                    record[10], current_time, current_time, f"[{current_time}] Inserted: {tuple(record)}"
                )

                cursor.execute(query_insert_group, insert_values_group)
        else:
            # Item Name is provided, perform operations based on Item Name and Item Group

            # Check if the record exists based on Customer name, Item name, and Item group
            query_select = """
                SELECT COUNT(*), *
                FROM Customer_price_info
                WHERE [Customer name] = ? AND [Item Name] = ? AND [Item group] = ?
            """
            select_values = (record[0], record[1], record[2])  # Customer name, Item name, Item group

            cursor.execute(query_select, select_values)
            result = cursor.fetchone()
            exists = result[0] > 0

            if exists:
                # Get existing record for logremarks
                existing_record = result[1:]
                existing_log = existing_record[-1] if existing_record[-1] else ""

                # Update the record if it exists
                query_update = """
                    UPDATE Customer_price_info
                    SET [Bill Sundry] = ?, 
                        ItemDiscount1 = COALESCE(?, 0.0), ItemDiscount2 = COALESCE(?, 0.0), ItemDiscount3 = COALESCE(?, 0.0),
                        itemgroupDiscount1 = 0.0, itemgroupDiscount2 = 0.0, itemgroupDiscount3 = 0.0,
                        Comment = ?,
                        updated_at = ?,
                        logremarks = ?
                    WHERE [Customer name] = ? AND [Item Name] = ? AND [Item group] = ?
                """
                update_values = (
                    record[3], record[4], record[5], record[6], record[10], current_time, 
                    f"{existing_log.strip()}[{current_time}] Updated from {existing_record} to {tuple(record)}", 
                    record[0], record[1], record[2]
                )

                cursor.execute(query_update, update_values)
            else:
                # Insert a new record if it does not exist
                query_insert = """
                    INSERT INTO Customer_price_info
                    ([Customer name], [Item Name], [Item group], [Bill Sundry], 
                     ItemDiscount1, ItemDiscount2, ItemDiscount3, 
                     itemgroupDiscount1, itemgroupDiscount2, itemgroupDiscount3, 
                     Comment, created_at, updated_at, logremarks)
                    VALUES (?, ?, ?, ?, COALESCE(?, 0.0), COALESCE(?, 0.0), COALESCE(?, 0.0), COALESCE(?, 0.0), COALESCE(?, 0.0), COALESCE(?, 0.0), ?, ?, ?, ?)
                """
                insert_values = (
                    record[0], record[1], record[2], record[3], record[4], record[5], record[6], 
                    0.0, 0.0, 0.0, record[10], current_time, current_time, 
                    f"[{current_time}] Inserted: {tuple(record)}"
                )

                cursor.execute(query_insert, insert_values)

        # Commit the transaction
        conn.commit()
        print("Record saved or updated successfully.")
    except sqlite3.Error as e:
        # Roll back the transaction in case of an error
        conn.rollback()
        print(f"An error occurred while saving or updating the record: {e}")
    finally:
        # Ensure the database connection is closed
        conn.close()


# Function to create a main table for the customer
def create_main_table_for_customer(customer):
    create_main_table(customer)


def export_to_excel(data, customer_name):
    folder_path = os.path.join(os.getcwd(), customer_name)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    file_path = os.path.join(folder_path, f"{customer_name}_data.xlsx")
    
    df = pd.DataFrame(data, columns=['Customer Name', 'Item Name', 'Item Group', 'Bill Sundry', 'Discount 1', 'Discount 2', 'Discount 3', 'GroupDisc1', 'GroupDisc2', 'GroupDisc3', 'Comment'])
    df.to_excel(file_path, index=False)
    
    sg.popup(f'Data exported to {file_path}')
    
    # Open the Excel file
    try:
        if os.name == 'nt':  # Windows
            os.startfile(file_path)
        elif os.name == 'posix':  # macOS or Linux
            subprocess.call(['open', file_path] if sys.platform == 'darwin' else ['xdg-open', file_path])
    except Exception as e:
        sg.popup(f'Failed to open the file: {str(e)}')


def upload_image(customer_name):
    folder_path = os.path.join(os.getcwd(), customer_name)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    file_path = sg.popup_get_file('Select an image to upload')
    if file_path:
        shutil.copy(file_path, folder_path)
        sg.popup(f'Image uploaded to {folder_path}')

def show_customer_price_mapping():
    customers = fetch_customer_names()
    items = fetch_item_names()
    item_groups = fetch_item_groups()
    bill_sundries = fetch_bill_sundries()
    table_data = []
    selected_customer = None

    layout = [
        [sg.Text('Customer Selection', size=(20, 1)), sg.InputText(key='-CUSTOMER-', size=(30, 1), enable_events=True), sg.Listbox(values=[], key='-SUGGESTIONS-', size=(30, 5), enable_events=True, visible=False)],
        [sg.Button('Submit')],
        [sg.Text('Item Name', size=(10, 1)), sg.InputText(key='-ITEM_NAME-', size=(30, 1), enable_events=True), sg.Listbox(values=[], key='-ITEM_SUGGESTIONS-', size=(30, 5), enable_events=True, visible=False)],
        [sg.Text('Item Group', size=(10, 1)), sg.InputText(key='-ITEM_GROUP-', size=(30, 1), enable_events=True), sg.Listbox(values=[], key='-ITEM_GROUP_SUGGESTIONS-', size=(30, 5), enable_events=True, visible=False)],
        [sg.Text('Bill Sundry', size=(10, 1)), sg.InputText(key='-BILL_SUNDRY-', size=(30, 1), enable_events=True), sg.Listbox(values=[], key='-BILL_SUNDRY_SUGGESTIONS-', size=(30, 5), select_mode=sg.LISTBOX_SELECT_MODE_MULTIPLE, enable_events=True, visible=False)],
        [sg.Text('Discount 1', size=(10, 1)), sg.InputText(key='-DISCOUNT_1-', size=(30, 1))],
        [sg.Text('Discount 2', size=(10, 1)), sg.InputText(key='-DISCOUNT_2-', size=(30, 1))],
        [sg.Text('Discount 3', size=(10, 1)), sg.InputText(key='-DISCOUNT_3-', size=(30, 1))],
        [sg.Text('Comment', size=(10, 1)), sg.InputText(key='-COMMENT-', size=(30, 1))],
        [sg.Button('Add Record'), sg.Button('Export to Excel'), sg.Button('Upload Image')],
        [sg.Text('Copy Records to New Customer')],
        [sg.Text('New Customer:', size=(15, 1)), sg.InputText(key='-NEW_CUSTOMER-', size=(30, 1), enable_events=True), sg.Listbox(values=[], key='-NEW_SUGGESTIONS-', size=(30, 5), enable_events=True, visible=False)],
        [sg.Button('Copy')],
        [sg.Table(values=table_data, 
              headings=['Customer Name', 'Item Name', 'Item Group', 'Bill Sundry', 'Discount 1', 'Discount 2', 'Discount 3', 'GroupDisc1', 'GroupDisc2', 'GroupDisc3', 'Comment'], 
              key='-ITEM_TABLE-', 
              enable_events=True, 
              justification='Left', 
              col_widths=[20, 40, 20, 20, 15, 15, 15, 15, 15, 15, 20],  
              size=(700, 700),  
              num_rows=40,
              auto_size_columns=True,
              display_row_numbers=False)]
        ]

    window = sg.Window('Customer Price Mapping', layout, finalize=True)
    window.maximize()

    while True:
        event, values = window.read()
        if event == sg.WINDOW_CLOSED:
            break
        if event == 'Submit':
            selected_customer = values['-CUSTOMER-']
            if not selected_customer.strip():
                sg.popup('Please select a customer name first.')
            else:                                
                table_data = fetch_records_from_main_table(selected_customer)
                window['-ITEM_TABLE-'].update(values=table_data)
        elif event == '-CUSTOMER-':
            typed_text = values['-CUSTOMER-']
            if len(typed_text) >= 2:
                filtered_customers = [customer for customer in customers if customer.lower().startswith(typed_text.lower())]
                window['-SUGGESTIONS-'].update(values=filtered_customers, visible=bool(filtered_customers))
            else:
                window['-SUGGESTIONS-'].update(values=[], visible=False)
        elif event == '-SUGGESTIONS-':
            selected_customer = values['-SUGGESTIONS-'][0]
            window['-CUSTOMER-'].update(selected_customer)
            window['-SUGGESTIONS-'].update(values=[], visible=False)
        elif event == '-ITEM_NAME-':
            typed_text = values['-ITEM_NAME-']
            if len(typed_text) >= 2:
                filtered_items = [item for item in items if item.lower().startswith(typed_text.lower())]
                window['-ITEM_SUGGESTIONS-'].update(values=filtered_items, visible=bool(filtered_items))
            else:
                window['-ITEM_SUGGESTIONS-'].update(values=[], visible=False)
        elif event == '-ITEM_SUGGESTIONS-':
            selected_item = values['-ITEM_SUGGESTIONS-'][0]
            window['-ITEM_NAME-'].update(selected_item)
            window['-ITEM_SUGGESTIONS-'].update(values=[], visible=False)
            item_group = fetch_item_group(selected_item)
            window['-ITEM_GROUP-'].update(item_group)
        elif event == '-ITEM_GROUP-':
            if not values['-ITEM_NAME-'].strip():
                typed_text = values['-ITEM_GROUP-']
                if len(typed_text) >= 2:
                    filtered_groups = [group for group in item_groups if group.lower().startswith(typed_text.lower())]
                    window['-ITEM_GROUP_SUGGESTIONS-'].update(values=filtered_groups, visible=bool(filtered_groups))
                else:
                    window['-ITEM_GROUP_SUGGESTIONS-'].update(values=[], visible=False)
        elif event == '-ITEM_GROUP_SUGGESTIONS-':
            selected_group = values['-ITEM_GROUP_SUGGESTIONS-'][0]
            window['-ITEM_GROUP-'].update(selected_group)
            window['-ITEM_GROUP_SUGGESTIONS-'].update(values=[], visible=False)
        elif event == '-BILL_SUNDRY-':
            typed_text = values['-BILL_SUNDRY-']
            if len(typed_text) >= 2:
                filtered_sundries = [sundry for sundry in bill_sundries if sundry.lower().startswith(typed_text.lower())]
                window['-BILL_SUNDRY_SUGGESTIONS-'].update(values=filtered_sundries, visible=bool(filtered_sundries))
            else:
                window['-BILL_SUNDRY_SUGGESTIONS-'].update(values=[], visible=False)
        elif event == '-BILL_SUNDRY_SUGGESTIONS-':
            selected_sundries = values['-BILL_SUNDRY_SUGGESTIONS-']
            window['-BILL_SUNDRY-'].update(', '.join(selected_sundries))
            window['-BILL_SUNDRY_SUGGESTIONS-'].update(values=[], visible=False)
        elif event == 'Add Record':
            record = (
                selected_customer,
                values['-ITEM_NAME-'],
                values['-ITEM_GROUP-'],
                values['-BILL_SUNDRY-'],
                float(values['-DISCOUNT_1-']) if values['-DISCOUNT_1-'] else None,
                float(values['-DISCOUNT_2-']) if values['-DISCOUNT_2-'] else None,
                float(values['-DISCOUNT_3-']) if values['-DISCOUNT_3-'] else None,
                None, None, None,  # Item group discounts
                values['-COMMENT-']
            )
            save_or_update_record_to_main_table(record)
            sg.popup('Record added successfully.')
            table_data = fetch_records_from_main_table(selected_customer)
            window['-ITEM_TABLE-'].update(values=table_data)
        elif event == 'Save Record':
            # Similar logic to add record, update item if it already exists
            record = (
                selected_customer,
                values['-ITEM_NAME-'],
                values['-ITEM_GROUP-'],
                values['-BILL_SUNDRY-'],
                float(values['-DISCOUNT_1-']) if values['-DISCOUNT_1-'] else None,
                float(values['-DISCOUNT_2-']) if values['-DISCOUNT_2-'] else None,
                float(values['-DISCOUNT_3-']) if values['-DISCOUNT_3-'] else None,
                None, None, None,  # Item group discounts
                values['-COMMENT-']
            )
            save_or_update_record_to_main_table(record)
            sg.popup('Record saved successfully.')
            table_data = fetch_records_from_main_table(selected_customer)
            window['-ITEM_TABLE-'].update(values=table_data)
        elif event == 'Copy':
            new_customer = values['-NEW_CUSTOMER-']
            if not selected_customer or not new_customer.strip():
                sg.popup('Please select both old and new customer names.')
            else:
                copy_records_to_new_customer(selected_customer, new_customer)
                table_data = fetch_records_from_main_table(new_customer)
                window['-ITEM_TABLE-'].update(values=table_data)
        elif event == '-NEW_CUSTOMER-':
            typed_text = values['-NEW_CUSTOMER-']
            if len(typed_text) >= 2:
                filtered_new_customers = [customer for customer in customers if customer.lower().startswith(typed_text.lower())]
                window['-NEW_SUGGESTIONS-'].update(values=filtered_new_customers, visible=bool(filtered_new_customers))
            else:
                window['-NEW_SUGGESTIONS-'].update(values=[], visible=False)
        elif event == '-NEW_SUGGESTIONS-':
            new_customer = values['-NEW_SUGGESTIONS-'][0]
            window['-NEW_CUSTOMER-'].update(new_customer)
            window['-NEW_SUGGESTIONS-'].update(values=[], visible=False)
        elif event == 'Export to Excel':
            export_to_excel(table_data, selected_customer)
        elif event == 'Upload Image':
            upload_image(selected_customer)

    window.close()

    
def create_sale_invoice():
    conn = sqlite3.connect('local_db.db')
    c = conn.cursor()

    # Create sales_invoice table if not exists
    c.execute("""
        CREATE TABLE IF NOT EXISTS sales_invoice (
            _id TEXT,
            order_id TEXT,
            name TEXT,
            shop_name TEXT,
            ordershop_name TEXT,
            transport_name TEXT,
            isd TEXT,
            mobile TEXT,
            city TEXT,
            invoice_number TEXT PRIMARY KEY,
            subtotal INTEGER,
            discount INTEGER,
            total INTEGER,
            remark TEXT,
            status TEXT,
            batch_id TEXT,
            updated_at TEXT,
            created_at TEXT,
            IsSync TEXT DEFAULT NULL,
            total_item_quantity INTEGER,  -- New column added for total item quantity
            SalesType TEXT DEFAULT 'L/GST-TaxIncl.'  -- Set default value for SalesType
        )
    """)

    # Create invoice_items table if not exists
    c.execute("""
        CREATE TABLE IF NOT EXISTS invoice_items (
            _id TEXT,
            invoice_number TEXT,
            size TEXT,
            MOQ INTEGER,
            price REAL,
            qty INTEGER,
            color TEXT,
            code TEXT,
            total REAL,
            subtotal REAL,
            discount REAL,
            comment TEXT,
            name TEXT,
            brand TEXT,
            category TEXT,
            rack_no TEXT,
            rowno INTEGER,  -- Sequential numbering
            paramrowno INTEGER,  -- Sequential numbering
            FOREIGN KEY (invoice_number) REFERENCES sales_invoice (invoice_number)
        )
    """)

    # Check if rowno and paramrowno columns exist in invoice_items
    c.execute("PRAGMA table_info('invoice_items')")
    columns = c.fetchall()
    rowno_exists = any(column[1] == 'rowno' for column in columns)
    paramrowno_exists = any(column[1] == 'paramrowno' for column in columns)

    # If rowno column doesn't exist, add it
    if not rowno_exists:
        c.execute("ALTER TABLE invoice_items ADD COLUMN rowno INTEGER DEFAULT NULL")
        
    # If paramrowno column doesn't exist, add it
    if not paramrowno_exists:
        c.execute("ALTER TABLE invoice_items ADD COLUMN paramrowno INTEGER DEFAULT NULL")

    # Create sales_type table if not exists (example additional table)
    c.execute("""
        CREATE TABLE IF NOT EXISTS sales_type (            
            code TEXT,
            name TEXT
        )
    """)

    # Commit changes
    conn.commit()
    conn.close()
    
     # Automatically call API and show the sales invoice screen
    from_date, to_date = get_current_financial_year_dates()
    process_button_click(from_date, to_date)
    show_sales_invoice_screen()

def fetch_data_from_db(from_date, to_date):
    conn = sqlite3.connect('local_db.db')
    c = conn.cursor()

    query = """
        SELECT 
    strftime('%d-%m-%Y', si.created_at) AS formatted_created_at, 
    si.invoice_number AS invoice_number, 
    si.shop_name AS shop_name,
    si.ordershop_name AS shop_name,
    si.SalesType,
    si.mobile AS mobile,
    COALESCE(SUM(ii.qty), 0) AS total_qty,
    si.total AS total_amount
FROM 
    sales_invoice AS si
LEFT JOIN 
    invoice_items AS ii ON si.invoice_number = ii.invoice_number
WHERE  
date(si.updated_at) BETWEEN date(?) AND date(?) and
si.IsSync IS NULL
AND si.total_item_quantity >0
GROUP BY 
    si.invoice_number, 
    si.shop_name, 
    si.mobile, 
    si.total
ORDER BY 
    si.created_at;
    """
    
    try:
        # Debugging prints
        print("Executing query:")
        print(query)
        print("With parameters:")
        print(f"from_date: {from_date}, to_date: {to_date}")

        c.execute(query, (from_date, to_date))
        rows = c.fetchall()

        # Debugging print for fetched data
        print("Fetched data:")
        for row in rows:
            print(row)
        
    except Exception as e:
        print(f"Error fetching data: {e}")
        rows = []

    finally:
        conn.close()

    return rows


def process_button_click(from_date, to_date):
    base_url = "https://admin.fawz.in/api/v1/sales-invoice"
    headers = {"Authorization": "Bearer BOOT@QazWsx@API123"}

    # Construct the URL with the from_date and to_date as query parameters
    api_url = f"{base_url}?fromDate={from_date}&toDate={to_date}"

    # Print the URL for debugging purposes
    print(f"Request URL: {api_url}")

    response = requests.get(api_url,headers=headers)    
    
    if response.status_code == 200:
        data = response.json()
        conn = sqlite3.connect('local_db.db')
        c = conn.cursor()
        
        for invoice in data['data']:
            c.execute("SELECT COUNT(*) FROM sales_invoice WHERE invoice_number = ?", (invoice['invoice_number'],))
            existing_count = c.fetchone()[0]
            
            if existing_count == 0:
                ordershop_name = invoice.get('ordershop_name', invoice['shop_name'])

                # Print the invoice payload
                print(f"Invoice Payload: {invoice}")

                # Print the SQL query for sales_invoice
                sales_invoice_query = """
                    INSERT INTO sales_invoice (
                        _id, created_at, order_id, name, shop_name, ordershop_name, transport_name, isd, mobile, city, invoice_number,
                        subtotal, discount, total, remark, status, batch_id, updated_at, total_item_quantity
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                print(f"SQL Query for sales_invoice: {sales_invoice_query}")

                # Execute the SQL query for sales_invoice
                c.execute(sales_invoice_query, (
                    invoice['_id'], invoice['package_date'], invoice['order_id'], invoice['name'], invoice['shop_name'], ordershop_name, invoice['transport_name'],
                    invoice['isd'], invoice['mobile'], invoice['city'], invoice['invoice_number'], invoice['subtotal'],
                    invoice['discount'], invoice['total'], invoice['remark'], invoice['status'], invoice['batch_id'],
                    invoice['updated_at'], invoice['total_item_quantity']
                ))

                for item in invoice['items']:
                    # Print the item payload
                    print(f"Item Payload: {item}")

                    # Print the SQL query for invoice_items
                    invoice_items_query = """
                        INSERT INTO invoice_items (
                            _id, invoice_number, size, MOQ, price, qty, color, code, total, subtotal, discount, comment, name, brand, category, rack_no, rowno, paramrowno
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """
                    print(f"SQL Query for invoice_items: {invoice_items_query}")                    

                    # Execute the SQL query for invoice_items
                    c.execute(invoice_items_query, (
                        invoice['_id'], invoice['invoice_number'], item.get('size'), item.get('MOQ'), item.get('price'), item.get('qty'),
                        item.get('color'), item.get('code'), item.get('total'), item.get('subtotal'), item.get('discount'), item.get('comment'),
                        item.get('name'), item.get('brand'), ', '.join(item.get('category', [])), item.get('rack_no'), item.get('index'), item.get('sub_index')
                    ))
            else:
                print(f"Skipping invoice with invoice_number {invoice['invoice_number']} as it already exists in the database.")
        
        conn.commit()
        conn.close()
    else:
        print(f"Failed to fetch data from API. Status code: {response.status_code}")

# Function to fetch valid shop names from AccountLedger table
def fetch_valid_shop_names():
    conn = sqlite3.connect('local_db.db')
    c = conn.cursor()
    query = "SELECT Name FROM AccountLedger"
    c.execute(query)
    shop_names = [row[0] for row in c.fetchall()]
    conn.close()
    return shop_names

# Function to fetch valid item names from stock_items table
def fetch_valid_item_names():
    conn = sqlite3.connect('local_db.db')
    c = conn.cursor()
    query = "SELECT Alias FROM stock_items"
    c.execute(query)
    item_names = [row[0] for row in c.fetchall()]
    conn.close()
    return item_names

# Function to check if item name and customer name match valid records
def check_item_customer_match(item_name, customer_name):
    valid_shop_names = fetch_valid_shop_names()
    valid_item_names = fetch_valid_item_names()

    if customer_name not in valid_shop_names:
        return "customer"
    if item_name not in valid_item_names:
        return "item"
    return "match"


# Function to show pop-up message
def show_popup(title, message):
    sg.popup(title, message)
        
def sync_to_busy():
    conn = sqlite3.connect('local_db.db')
    c = conn.cursor()
    
    # Fetch all unsynced invoices
    query = """
WITH ItemSpecificDiscounts AS (
    SELECT 
        si._id,
        si.order_id,
        ii.invoice_number,
        strftime('%d-%m-%Y', date(si.created_at)) AS formatted_created_at,
        si.shop_name AS name,
        si.shop_name AS shop_name,
        si.transport_name,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN ii.size 
            ELSE ii.color 
        END AS size,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN ii.color 
            ELSE ii.size 
        END AS color,
        ii.code,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN bcs.MRP 
            ELSE sti.SalePrice
        END AS SalePrice,
        ii.qty,
        si.IsSync,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN
                (bcs.MRP * COALESCE(cpi.ItemDiscount1, 0.0) / 100)
                + COALESCE(cpi.ItemDiscount2, 0.0)
                + (
                    (bcs.MRP - (bcs.MRP * COALESCE(cpi.ItemDiscount1, 0.0) / 100) - COALESCE(cpi.ItemDiscount2, 0.0))
                    * COALESCE(cpi.ItemDiscount3, 0.0) / 100
                )
            ELSE
                (sti.SalePrice * COALESCE(cpi.ItemDiscount1, 0.0) / 100)
                + COALESCE(cpi.ItemDiscount2, 0.0)
                + (
                    (sti.SalePrice - (sti.SalePrice * COALESCE(cpi.ItemDiscount1, 0.0) / 100) - COALESCE(cpi.ItemDiscount2, 0.0))
                    * COALESCE(cpi.ItemDiscount3, 0.0) / 100
                )
        END AS TotalDiscount,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN
                (bcs.MRP - (bcs.MRP * COALESCE(cpi.ItemDiscount1, 0.0) / 100))
                - COALESCE(cpi.ItemDiscount2, 0.0)
                - (
                    (bcs.MRP - (bcs.MRP * COALESCE(cpi.ItemDiscount1, 0.0) / 100) - COALESCE(cpi.ItemDiscount2, 0.0))
                    * COALESCE(cpi.ItemDiscount3, 0.0) / 100
                )
            ELSE
                (sti.SalePrice - (sti.SalePrice * COALESCE(cpi.ItemDiscount1, 0.0) / 100))
                - COALESCE(cpi.ItemDiscount2, 0.0)
                - (
                    (sti.SalePrice - (sti.SalePrice * COALESCE(cpi.ItemDiscount1, 0.0) / 100) - COALESCE(cpi.ItemDiscount2, 0.0))
                    * COALESCE(cpi.ItemDiscount3, 0.0) / 100
                )
        END AS Price,
        ii.qty * (
            CASE 
                WHEN sti.StockGroupname LIKE '%Campus%' THEN
                    (bcs.MRP - (bcs.MRP * COALESCE(cpi.ItemDiscount1, 0.0) / 100))
                    - COALESCE(cpi.ItemDiscount2, 0.0)
                    - (
                        (bcs.MRP - (bcs.MRP * COALESCE(cpi.ItemDiscount1, 0.0) / 100) - COALESCE(cpi.ItemDiscount2, 0.0))
                        * COALESCE(cpi.ItemDiscount3, 0.0) / 100
                    )
                ELSE
                    (sti.SalePrice - (sti.SalePrice * COALESCE(cpi.ItemDiscount1, 0.0) / 100))
                    - COALESCE(cpi.ItemDiscount2, 0.0)
                    - (
                        (sti.SalePrice - (sti.SalePrice * COALESCE(cpi.ItemDiscount1, 0.0) / 100) - COALESCE(cpi.ItemDiscount2, 0.0))
                        * COALESCE(cpi.ItemDiscount3, 0.0) / 100
                    )
            END
        ) AS item_total,
        si.status,
        si.mobile,
        si.city,
        ii.MOQ,
        COALESCE(
            NULLIF(cpi.ItemDiscount1 || 'PL+' || cpi.ItemDiscount2 || 'MU+' || cpi.ItemDiscount3 || 'PP', '0.0PL+0.0MU+0.0PP'), 
            NULLIF(cpi.ItemDiscount1 || 'PL+' || cpi.ItemDiscount2 || 'MU', '0.0PL+0.0MU'), 
            NULLIF(cpi.ItemDiscount1 || 'PL+' || cpi.ItemDiscount3 || 'PP', '0.0PL+0.0PP'), 
            NULLIF(cpi.ItemDiscount2 || 'MU+' || cpi.ItemDiscount3 || 'PP', '0.0MU+0.0PP'), 
            cpi.ItemDiscount1 || 'PL', 
            cpi.ItemDiscount2 || 'MU', 
            cpi.ItemDiscount3 || 'PP'
        ) AS Compound_discount,
        SUBSTR(ii.comment, 1, 30) AS comment,
        SUBSTR(si.remark, 1, 30) AS remark,
        sti.StockGroupname,
       COALESCE(bcs.MRP, '') AS MRP,
        COALESCE(bcs.Eancode, '') AS Eancode,
        ii.code AS Itemcode,
        ii.rowno,
        ii.paramrowno,
		ROW_NUMBER() OVER(PARTITION BY ii.invoice_number,ii.code, ii.color, ii.size ORDER BY COALESCE(bcs.MRP, sti.SalePrice) DESC) AS rn,
		si.SalesType
    FROM 
        sales_invoice AS si
    INNER JOIN 
        invoice_items AS ii ON si.invoice_number = ii.invoice_number
    INNER JOIN 
        stock_items AS sti ON sti.Alias = ii.code
    LEFT JOIN
        BusyClosingStock AS bcs ON (
            (sti.StockGroupname LIKE '%Campus%' AND bcs.Itemcode = ii.code AND bcs.size = ii.color AND bcs.color = ii.size)
            OR 
            (sti.StockGroupname LIKE '%Campus%' AND bcs.Itemcode = ii.code AND bcs.color = ii.color AND bcs.size = ii.size)
            OR 
            (sti.StockGroupname NOT LIKE '%Campus%' AND bcs.Itemcode = ii.code AND bcs.size = ii.size AND bcs.color = ii.color)
        )
    INNER JOIN 
        Customer_price_info AS cpi ON si.shop_name = cpi.[Customer name] 
                                    AND cpi.[Item Name] = ii.code
                                    AND COALESCE(cpi.ItemDiscount1, 0.0) IS NOT NULL
                                    AND COALESCE(cpi.ItemDiscount2, 0.0) IS NOT NULL
                                    AND COALESCE(cpi.ItemDiscount3, 0.0) IS NOT NULL
    WHERE 
        ii.qty IS NOT NULL
        AND si.IsSync IS NULL
),
GroupDiscounts AS (
    SELECT 
        si._id,
        si.order_id,
        ii.invoice_number,
        strftime('%d-%m-%Y', date(si.created_at)) AS formatted_created_at,
        si.shop_name AS name,
        si.shop_name AS shop_name,
        si.transport_name,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN ii.size 
            ELSE ii.color 
        END AS size,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN ii.color 
            ELSE ii.size 
        END AS color,
        ii.code,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN bcs.MRP
            ELSE sti.SalePrice
        END AS SalePrice,
        ii.qty,
        si.IsSync,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN
                (bcs.MRP * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100)
                + COALESCE(cpi.itemgroupDiscount2, 0.0)
                + (
                    (bcs.MRP - (bcs.MRP * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100) - COALESCE(cpi.itemgroupDiscount2, 0.0))
                    * COALESCE(cpi.itemgroupDiscount3, 0.0) / 100
                )
            ELSE
                (sti.SalePrice * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100)
                + COALESCE(cpi.itemgroupDiscount2, 0.0)
                + (
                    (sti.SalePrice - (sti.SalePrice * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100) - COALESCE(cpi.itemgroupDiscount2, 0.0))
                    * COALESCE(cpi.itemgroupDiscount3, 0.0) / 100
                )
        END AS TotalDiscount,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN
                (bcs.MRP - (bcs.MRP * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100))
                - COALESCE(cpi.itemgroupDiscount2, 0.0)
                - (
                    (bcs.MRP - (bcs.MRP * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100) - COALESCE(cpi.itemgroupDiscount2, 0.0))
                    * COALESCE(cpi.itemgroupDiscount3, 0.0) / 100
                )
            ELSE
                (sti.SalePrice - (sti.SalePrice * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100))
                - COALESCE(cpi.itemgroupDiscount2, 0.0)
                - (
                    (sti.SalePrice - (sti.SalePrice * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100) - COALESCE(cpi.itemgroupDiscount2, 0.0))
                    * COALESCE(cpi.itemgroupDiscount3, 0.0) / 100
                )
        END AS Price,
        ii.qty * (
            CASE 
                WHEN sti.StockGroupname LIKE '%Campus%' THEN
                    (bcs.MRP - (bcs.MRP * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100))
                    - COALESCE(cpi.itemgroupDiscount2, 0.0)
                    - (
                        (bcs.MRP - (bcs.MRP * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100) - COALESCE(cpi.itemgroupDiscount2, 0.0))
                        * COALESCE(cpi.itemgroupDiscount3, 0.0) / 100
                    )
                ELSE
                    (sti.SalePrice - (sti.SalePrice * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100))
                    - COALESCE(cpi.itemgroupDiscount2, 0.0)
                    - (
                        (sti.SalePrice - (sti.SalePrice * COALESCE(cpi.itemgroupDiscount1, 0.0) / 100) - COALESCE(cpi.itemgroupDiscount2, 0.0))
                        * COALESCE(cpi.itemgroupDiscount3, 0.0) / 100
                    )
            END
        ) AS item_total,
        si.status,
        si.mobile,
        si.city,
        ii.MOQ,
        COALESCE(
            NULLIF(cpi.itemgroupDiscount1 || 'PL+' || cpi.itemgroupDiscount2 || 'MU+' || cpi.itemgroupDiscount3 || 'PP', '0.0PL+0.0MU+0.0PP'), 
            NULLIF(cpi.itemgroupDiscount1 || 'PL+' || cpi.itemgroupDiscount2 || 'MU', '0.0PL+0.0MU'), 
            NULLIF(cpi.itemgroupDiscount1 || 'PL+' || cpi.itemgroupDiscount3 || 'PP', '0.0PL+0.0PP'), 
            NULLIF(cpi.itemgroupDiscount2 || 'MU+' || cpi.itemgroupDiscount3 || 'PP', '0.0MU+0.0PP'),
            cpi.itemgroupDiscount1 || 'PL', 
            cpi.itemgroupDiscount2 || 'MU', 
            cpi.itemgroupDiscount3 || 'PP'
        ) AS Compound_discount,
        SUBSTR(ii.comment, 1, 30) AS comment,
        SUBSTR(si.remark, 1, 30) AS remark,
        sti.StockGroupname,
		COALESCE(bcs.MRP, '') AS MRP,
        COALESCE(bcs.Eancode, '') AS Eancode,
        ii.code AS Itemcode,
        ii.rowno,
        ii.paramrowno,
		ROW_NUMBER() OVER(PARTITION BY ii.invoice_number,ii.code, ii.color, ii.size ORDER BY COALESCE(bcs.MRP, sti.SalePrice) DESC) AS rn,
		si.SalesType
    FROM 
        sales_invoice AS si
    INNER JOIN 
        invoice_items AS ii ON si.invoice_number = ii.invoice_number
    INNER JOIN 
        stock_items AS sti ON sti.Alias = ii.code
    LEFT JOIN
        BusyClosingStock AS bcs ON (
            (sti.StockGroupname LIKE '%Campus%' AND bcs.Itemcode = ii.code AND bcs.size = ii.color AND bcs.color = ii.size)
            OR 
            (sti.StockGroupname LIKE '%Campus%' AND bcs.Itemcode = ii.code AND bcs.color = ii.color AND bcs.size = ii.size)
            OR 
            (sti.StockGroupname NOT LIKE '%Campus%' AND bcs.Itemcode = ii.code AND bcs.size = ii.size AND bcs.color = ii.color)
        )
    INNER JOIN 
        Customer_price_info AS cpi ON si.shop_name = cpi.[Customer name] 
                                    AND (cpi.[Item Name] IS NULL OR TRIM(cpi.[Item Name]) = '')
                                    AND cpi.[Item GROUP] = sti.StockGroupname
                                    AND (COALESCE(cpi.itemgroupDiscount1, 0.0) > 0.0
                                         OR COALESCE(cpi.itemgroupDiscount2, 0.0) > 0.0
                                         OR COALESCE(cpi.itemgroupDiscount3, 0.0) > 0.0)
    WHERE 
        ii.qty IS NOT NULL
        AND si.IsSync IS NULL
        AND NOT EXISTS (
            SELECT 1
            FROM Customer_price_info cpi2
            WHERE cpi2.[Customer name] = si.shop_name 
            AND cpi2.[Item Name] = ii.code
            AND COALESCE(cpi2.ItemDiscount1, 0.0) IS NOT NULL
            AND COALESCE(cpi2.ItemDiscount2, 0.0) IS NOT NULL
            AND COALESCE(cpi2.itemDiscount3, 0.0) IS NOT NULL
        )
),
stock_itemsDiscounts AS (
    SELECT 
        si._id,
        si.order_id,
        ii.invoice_number,
        strftime('%d-%m-%Y', date(si.created_at)) AS formatted_created_at,
        si.shop_name AS name,
        si.shop_name AS shop_name,
        si.transport_name,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN ii.size 
            ELSE ii.color 
        END AS size,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN ii.color 
            ELSE ii.size 
        END AS color,
        ii.code,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN COALESCE(bcs.MRP, sti.SalePrice)
            ELSE sti.SalePrice
        END AS SalePrice,
        ii.qty,
        si.IsSync,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN
                (COALESCE(bcs.MRP, sti.SalePrice) * COALESCE(sti.Discount, 0) / 100)
            ELSE
                (sti.SalePrice * COALESCE(sti.Discount, 0) / 100)
        END AS TotalDiscount,
        CASE 
            WHEN sti.StockGroupname LIKE '%Campus%' THEN
                (COALESCE(bcs.MRP, sti.SalePrice) - (COALESCE(bcs.MRP, sti.SalePrice) * COALESCE(sti.Discount, 0) / 100))
            ELSE
                (sti.SalePrice - (sti.SalePrice * COALESCE(sti.Discount, 0) / 100))
        END AS Price,
        ii.qty * (
            CASE 
                WHEN sti.StockGroupname LIKE '%Campus%' THEN
                    (COALESCE(bcs.MRP, sti.SalePrice) - (COALESCE(bcs.MRP, sti.SalePrice) * COALESCE(sti.Discount, 0) / 100))
                ELSE
                    (sti.SalePrice - (sti.SalePrice * COALESCE(sti.Discount, 0) / 100))
            END
        ) AS item_total,
        si.status,
        si.mobile,
        si.city,
        ii.MOQ,
        COALESCE(NULLIF(sti.Discount || 'PL', '0PL'), sti.Discount || 'PL') AS Compound_discount,
        SUBSTR(ii.comment, 1, 30) AS comment,
        SUBSTR(si.remark, 1, 30) AS remark,
        sti.StockGroupname,
        COALESCE(bcs.MRP, '') AS MRP, 
        COALESCE(bcs.Eancode, '') AS Eancode,
        ii.code AS Itemcode,
        ii.rowno,
        ii.paramrowno,
        -- Add a ROW_NUMBER to find maximum MRP later        
        ROW_NUMBER() OVER(PARTITION BY ii.invoice_number, ii.code, ii.color, ii.size ORDER BY COALESCE(bcs.MRP, sti.SalePrice) DESC) AS rn,
        si.SalesType
    FROM 
        sales_invoice AS si
    INNER JOIN 
        invoice_items AS ii ON si.invoice_number = ii.invoice_number
    LEFT JOIN 
        stock_items AS sti ON sti.Alias = ii.code
    LEFT JOIN
        BusyClosingStock AS bcs ON (
            (sti.StockGroupname LIKE '%Campus%' AND bcs.Itemcode = ii.code AND bcs.size = ii.color AND bcs.color = ii.size)
            OR 
            (sti.StockGroupname LIKE '%Campus%' AND bcs.Itemcode = ii.code AND bcs.color = ii.color AND bcs.size = ii.size)
            OR 
            (sti.StockGroupname NOT LIKE '%Campus%' AND bcs.Itemcode = ii.code AND bcs.size = ii.size AND bcs.color = ii.color)
        )
    WHERE 
        ii.qty IS NOT NULL
        AND si.IsSync IS NULL
        AND NOT EXISTS (
            SELECT 1
            FROM Customer_price_info cpi
            WHERE cpi.[Customer name] = si.shop_name and cpi.[item GROUP]=sti.StockGroupname and (cpi.[item name] IS NULL OR cpi.[item name] = '')
			
        )
)
SELECT * FROM ItemSpecificDiscounts
WHERE rn = 1
UNION ALL
SELECT * FROM GroupDiscounts
WHERE rn = 1
UNION ALL
SELECT * FROM stock_itemsDiscounts
WHERE rn = 1
ORDER BY rowno, paramrowno;
    """
        
    c.execute(query)
    invoices = c.fetchall()

    # Check if query returned data
    if not invoices:
        print("No invoices to sync.")
        return None

    # Create a dictionary to group invoices by invoice_id
    invoices_dict = {}

    for invoice in invoices:
        invoice_id = invoice[2]  # Assuming invoice[2] contains the invoice_number
        item_name = str(invoice[9])
        customer_name = invoice[5]  # Assuming invoice[5] contains the customer name

        # Check for item and customer match
        match_result = check_item_customer_match(item_name, customer_name)
        if match_result == "customer":
            message = f"Customer name does not match valid records.\nInvoice Number: {invoice_id}\nCustomer Name: {customer_name}"
            print(f"Mismatch Found: {message}")
            show_popup("Mismatch Found", message)
            return  # Exit sync process if mismatch found
        elif match_result == "item":
            message = f"Item name does not match valid records.\nInvoice Number: {invoice_id}\nItem Name: {item_name}"
            print(f"Mismatch Found: {message}")
            show_popup("Mismatch Found", message)
            return  # Exit sync process if mismatch found

        # Proceed with processing the invoice

        if invoice_id not in invoices_dict:
            # Create a new Sale element for this invoice_id
            invoices_dict[invoice_id] = ET.Element("Sale")

            # Add remaining fields to the Sale element
            ET.SubElement(invoices_dict[invoice_id], "VchSeriesName").text = "Fawz"
            ET.SubElement(invoices_dict[invoice_id], "Date").text = str(invoice[3])  # Use the formatted_created_at
            ET.SubElement(invoices_dict[invoice_id], "VchNo").text = str(invoice[2])
            ET.SubElement(invoices_dict[invoice_id], "STPTName").text = str(invoice[30])
            ET.SubElement(invoices_dict[invoice_id], "MasterName1").text = str(invoice[5])
            ET.SubElement(invoices_dict[invoice_id], "MasterName2").text = "MAIN STORE"

             # Add VchOtherInfoDetails element
            vch_other_info_details = ET.SubElement(invoices_dict[invoice_id], "VchOtherInfoDetails")
            ET.SubElement(vch_other_info_details, "Narration1").text = f"{invoice[5]} {invoice[18]} {invoice[1]}"                    

        # Find or create ItemEntries element for this invoice_id
        item_entries = invoices_dict[invoice_id].find("ItemEntries")
        if item_entries is None:
            item_entries = ET.SubElement(invoices_dict[invoice_id], "ItemEntries")

        # Check if ItemDetail for this item_name and price already exists in the current invoice_id
        sale_price = str(invoice[14])

        existing_item_detail = None

        for item_detail in item_entries.findall("ItemDetail"):
            if item_detail.find("ItemName").text == item_name and item_detail.find("Price").text == sale_price:
                existing_item_detail = item_detail
                break

        if existing_item_detail is None:
            # Create a new ItemDetail element
            item_detail = ET.SubElement(item_entries, "ItemDetail")

            # Add remaining fields to ItemDetail element
            ET.SubElement(item_detail, "SrNo").text = str(invoice[27])
            ET.SubElement(item_detail, "ItemName").text = item_name
            ET.SubElement(item_detail, "UnitName").text = "Pcs."
            ET.SubElement(item_detail, "Qty").text = str(invoice[11])
            ET.SubElement(item_detail, "MRP").text = str(invoice[10])
            ET.SubElement(item_detail, "ListPrice").text = str(invoice[10])
            ET.SubElement(item_detail, "Price").text = sale_price
            ET.SubElement(item_detail, "Amt").text = str(invoice[15])
            ET.SubElement(item_detail, "Discount").text = str(invoice[13])
            ET.SubElement(item_detail, "CompoundDiscount").text = str(invoice[20])
            ET.SubElement(item_detail, "STAmount").text = ""
            ET.SubElement(item_detail, "STPercent").text = ""
            ET.SubElement(item_detail, "STPercent1").text = ""
            ET.SubElement(item_detail, "TaxBeforeSurcharge").text = ""
            ET.SubElement(item_detail, "TaxBeforeSurcharge1").text = ""
            ET.SubElement(item_detail, "MC").text = "Main Store"

            # Create ParamStockEntries element
            param_stock_entries = ET.SubElement(item_detail, "ParamStockEntries")
        else:
            # Update existing ItemDetail element by summing the Qty and Amt
            existing_qty = int(existing_item_detail.find("Qty").text)
            new_qty = existing_qty + int(invoice[11])
            existing_item_detail.find("Qty").text = str(new_qty)

            existing_amt = float(existing_item_detail.find("Amt").text)
            new_amt = existing_amt + float(invoice[15])
            existing_item_detail.find("Amt").text = str(new_amt)

            param_stock_entries = existing_item_detail.find("ParamStockEntries")

        # Add ParamStockDetails element for each parameter row
        param_stock_details = ET.SubElement(param_stock_entries, "ParamStockDetails")

        # Add remaining fields to ParamStockDetails element
        ET.SubElement(param_stock_details, "VchItemGridSN").text = str(invoice[27])
        ET.SubElement(param_stock_details, "SrNo").text = str(invoice[28])  # Assuming param_rows is index 28
        ET.SubElement(param_stock_details, "Param1").text = str(invoice[7])
        ET.SubElement(param_stock_details, "Param2").text = str(invoice[8])
        ET.SubElement(param_stock_details, "Param3").text = str(invoice[25])
        ET.SubElement(param_stock_details, "MainQty").text = str(invoice[11])
        ET.SubElement(param_stock_details, "MRP").text = str(invoice[24])
        ET.SubElement(param_stock_details, "MainUnitPrice").text = str(invoice[10])
        ET.SubElement(param_stock_details, "Amount").text = str(invoice[13])
        ET.SubElement(param_stock_details, "Party").text = str(invoice[5])

    # Convert each Sale element to XML strings
    xml_payloads = [ET.tostring(invoice, encoding="utf-8").decode() for invoice in invoices_dict.values()]

    # Check if XML strings are correctly formed
    for xml_str, invoice_id in zip(xml_payloads, invoices_dict.keys()):
        print(f"Payload for invoice {invoice_id}:\n{xml_str}")

        headers = {
            "SC": "2",
            "VchType": "9",
            "VchXML": xml_str,
            "UserName": "fawz",
            "Pwd": "fawz@52"
        }
        api_url = "http://localhost:981/"
        
        try:
            # Fetch result header for the invoice
            response = requests.post(api_url, headers=headers, data={'invoice_number': invoice_id})
            if response.status_code == 200:
                result_header = response.headers.get('Result')
                print(f"Result header for invoice {invoice_id}: {result_header}")  # Print header result for the invoice

                # Determine sync status based on result_header
                is_sync_status = 'Y' if result_header == 'T' else None

                # Update sync status in local database for the invoice
                sql_query = "UPDATE sales_invoice SET IsSync = ? WHERE invoice_number = ?"
                params = (is_sync_status, invoice_id)
                c.execute(sql_query, params)
                conn.commit()  # Commit the transaction

                print(f"Updated IsSync status for invoice {invoice_id} to {is_sync_status}")

            else:
                print(f"Failed to fetch result header for invoice {invoice_id}. Status code: {response.status_code}")

        except requests.RequestException as e:
            print(f"Request failed for invoice {invoice_id} with error: {str(e)}")

    conn.close()

    sg.popup("All invoices have been synced.")
    
def fetch_customer_suggestions(typed_text):
    if typed_text is None:
        typed_text = ""  # Set to an empty string if None
    conn = sqlite3.connect('local_db.db')
    c = conn.cursor()
    query = """
        SELECT Name
        FROM AccountLedger
        WHERE Name LIKE ?
    """
    c.execute(query, ('%' + typed_text + '%',))  # Provide the parameter as a tuple
    suggestions = [row[0] for row in c.fetchall()]
    conn.close()
    return suggestions

def fetch_sales_type_suggestions(typed_text):
    if typed_text is None:
        typed_text = ""  # Set to an empty string if None
    conn = sqlite3.connect('local_db.db')
    c = conn.cursor()
    query = """
        SELECT Name
        FROM Sales_type
        WHERE Name LIKE ?
    """
    c.execute(query, ('%' + typed_text + '%',))  # Provide the parameter as a tuple
    suggestions = [row[0] for row in c.fetchall()]
    conn.close()
    return suggestions

def fetch_invoice_suggestions(typed_text):
    conn = sqlite3.connect('local_db.db')
    c = conn.cursor()
    query = """
        SELECT invoice_number
        FROM sales_invoice
        WHERE invoice_number LIKE ?
    """
    c.execute(query, ('%' + typed_text + '%',))
    suggestions = [row[0] for row in c.fetchall()]
    conn.close()
    return suggestions

def fetch_table_name(customer_name):
    # Modify the customer name to Main_ and replace spacing with underscores
    modified_name = 'Main_' + customer_name.replace(' ', '_')
    # Simulate fetching the table name based on the modified customer name
    # In this example, we just return the modified name
    return modified_name

def fetch_distinct_customer_names(table_name):
    conn = sqlite3.connect('local_db.db')
    c = conn.cursor()
    query = f"""
        SELECT DISTINCT "Customer Name" 
        FROM Customer_price_info
    """
    c.execute(query)
    distinct_customers = [row[0] for row in c.fetchall()]
    conn.close()
    return distinct_customers


def update_sale_invoice_table_backend(record_id, new_shop_name):
    print(f"Updating backend for Invoice ID {record_id} with new Shop Name: {new_shop_name}")
    conn = sqlite3.connect('local_db.db')
    c = conn.cursor()
    query = """
        UPDATE Sales_invoice
        SET Shop_name = ?
        WHERE invoice_number = ?
    """
    c.execute(query, (new_shop_name, record_id))
    conn.commit()
    conn.close()
    print(f"Backend update completed for Invoice ID {record_id}")

def update_sales_type_backend(invoice_number, updated_sales_type):
    print(f"Backend update: Invoice {invoice_number}, Sales Type updated to {updated_sales_type}")
    conn = sqlite3.connect('local_db.db')
    c = conn.cursor()
    query = """
        UPDATE Sales_invoice
        SET SalesType = ?
        WHERE invoice_number = ?
    """
    c.execute(query, (updated_sales_type, invoice_number))
    conn.commit()
    conn.close()
    print(f"Backend update completed for Invoice Number {invoice_number}")
    
def update_table(row_index, col_index, value, table):
    table_data = table.get()
    table_data[row_index][col_index] = value
    table.update(values=table_data)
    print(f"Frontend table updated at row {row_index}, column {col_index} with value: {value}")
    
def update_dialog(data, row_index, table):
    typed_text = data[2]  # Get the current customer name
    suggestion_list = fetch_customer_suggestions(typed_text)  # Get suggestion list from backend based on the current customer name
    layout = [
        [sg.Text('Update Customer Name')],
        [sg.Text('Customer Name'), sg.Input(key='-CUSTOMER_NAME-', default_text=typed_text, enable_events=True)],
        [sg.Listbox(values=suggestion_list, size=(30, len(suggestion_list)), enable_events=True, key='-SUGGESTIONS-', visible=False)]  # Hidden listbox for suggestions
    ]
    window = sg.Window('Update Customer Name', layout, modal=True, return_keyboard_events=True)
    
    while True:
        event, values = window.read()
        if event in (sg.WINDOW_CLOSED, 'Escape:27'):
            break
        elif event == '-CUSTOMER_NAME-':
            typed_text = values['-CUSTOMER_NAME-']
            suggestion_list = fetch_customer_suggestions(typed_text)  # Get suggestions based on the typed text
            window['-SUGGESTIONS-'].update(values=suggestion_list, visible=True)  # Show the suggestion list
        elif event == '-SUGGESTIONS-' and values['-SUGGESTIONS-']:
            updated_name = values['-SUGGESTIONS-'][0]  # Take the first suggestion from the list
            print(f"Selected suggestion: {updated_name}")
            update_sale_invoice_table_backend(data[1], updated_name)  # Update sale invoice table at the backend
            update_table(row_index, 2, updated_name, table)  # Update customer name in the frontend table
            break
        elif event in ('Return:13', '\r'):
            if values['-SUGGESTIONS-']:
                updated_name = values['-SUGGESTIONS-'][0]  # Take the first suggestion from the list
                print(f"Selected suggestion with Enter: {updated_name}")
                update_sale_invoice_table_backend(data[1], updated_name)  # Update sale invoice table at the backend
                update_table(row_index, 2, updated_name, table)  # Update customer name in the frontend table
                break
        elif event == 'Control_L:17':
            next_event, _ = window.read(timeout=50)
            if next_event == 'k:107':
                window['-CUSTOMER_NAME-'].update('')  # Clear the input field on Ctrl+K
                window.refresh()

    window.close()


def get_current_financial_year_dates():
    today = datetime.today()
    start_date = today - timedelta(days=20)
    end_date = today
    return start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')

def show_sales_invoice_screen():
    layout = [
        [sg.Column([
            [sg.Text('Shop Name'), sg.Input(key='-SHOP_NAME-', enable_events=True)],
            [sg.Listbox(values=[], size=(30, 5), enable_events=True, key='-SEARCH_SUGGESTIONS-', visible=False)]
        ], size=(300, 80)),  # Fixed size for the column containing Shop Name
         sg.Column([
            [sg.Text('Sales Type'), sg.Input(key='-SALES_TYPE-', enable_events=True)],
            [sg.Listbox(values=[], size=(30, 5), enable_events=True, key='-SALES_TYPE_SUGGESTIONS-', visible=False)]
        ], size=(300, 80), element_justification='right')  # Fixed size for the column containing Sales Type
        ],
        [sg.Table(values=[], 
                  headings=['Package Date', 'Package ID', 'Fawz Shop Name', 'Busy Shop Name', 'Sales Type', 'Mobile', 'Package Qty Total(PRS)', 'Total Invoice Amount'],
                  auto_size_columns=False, justification='center', num_rows=30, 
                  col_widths=[14, 14, 25, 25, 15, 14, 25, 20],  # Adjusted column widths
                  text_color='black', background_color='lightblue', key='-TABLE-', 
                  enable_events=True, bind_return_key=True, right_click_menu=['&Right', ['Update Customer']])],
        [sg.Button('Sync to Busy')],
    ]

    window = sg.Window('Sales Invoice Table', layout, finalize=True, size=(1500, 700), resizable=True, grab_anywhere=True)
    window.maximize()

    selected_row = None  # Initialize selected_row to avoid unbound local error

    from_date, to_date = get_current_financial_year_dates()

    if from_date and to_date:
        data = fetch_data_from_db(from_date, to_date)
        table_data = [list(row) for row in data]
        window['-TABLE-'].update(values=table_data)
        selected_row = [0] if table_data else None  # Select the first row if data is available
        window['-TABLE-'].update(select_rows=selected_row)

    while True:
        event, values = window.read()  # No timeout needed here

        if event == sg.WINDOW_CLOSED:
            break
        elif event == 'Sync to Busy':                        
            sync_to_busy()
        elif event == '-TABLE-':  # Handle table events
            selected_row = values['-TABLE-']
            if selected_row:
                selected_row_index = selected_row[0]
                selected_data = window['-TABLE-'].get()[selected_row_index]
                print(f"Selected Invoice Number: {selected_data[1]} at index: {selected_row_index}")  # Adjust index based on your table structure
        elif event == '-SHOP_NAME-':  # Handle shop name input events
            typed_text = values['-SHOP_NAME-']
            suggestion_list = fetch_customer_suggestions(typed_text)
            window['-SEARCH_SUGGESTIONS-'].update(values=suggestion_list, visible=bool(suggestion_list))
        elif event == '-SEARCH_SUGGESTIONS-':  # Handle listbox selection events
            if values['-SEARCH_SUGGESTIONS-']:
                updated_name = values['-SEARCH_SUGGESTIONS-'][0]
                if selected_row:
                    selected_row_index = selected_row[0]
                    selected_data = window['-TABLE-'].get()[selected_row_index]
                    invoice_number = selected_data[1]  # Adjust index based on your table structure
                    print(f"Updating Invoice Number: {invoice_number} at index: {selected_row_index}")
                    update_sale_invoice_table_backend(invoice_number, updated_name)  # Pass invoice_number and updated_name to backend update function
                    update_table(selected_row_index, 2, updated_name, window['-TABLE-'])
                    # Update the table selection to the next row
                    if selected_row_index + 1 < len(window['-TABLE-'].Values):
                        next_row_index = selected_row_index + 1
                        window['-TABLE-'].update(select_rows=[next_row_index])
                window['-SHOP_NAME-'].update(value='')  # Clear the input field after updating
                window['-SEARCH_SUGGESTIONS-'].update(visible=False)
                # Move cursor to the shop name input box
                window['-SHOP_NAME-'].set_focus()
        elif event == '-SALES_TYPE-':  # Handle sales type input events
            typed_text = values['-SALES_TYPE-']
            suggestion_list = fetch_sales_type_suggestions(typed_text)
            window['-SALES_TYPE_SUGGESTIONS-'].update(values=suggestion_list, visible=bool(suggestion_list))
        elif event == '-SALES_TYPE_SUGGESTIONS-':  # Handle sales type suggestion selection events
            if values['-SALES_TYPE_SUGGESTIONS-']:
                updated_sales_type = values['-SALES_TYPE_SUGGESTIONS-'][0]
                if selected_row:
                    selected_row_index = selected_row[0]
                    selected_data = window['-TABLE-'].get()[selected_row_index]
                    invoice_number = selected_data[1]  # Adjust index based on your table structure
                    print(f"Updating Sales Type for Invoice Number: {invoice_number} at index: {selected_row_index}")
                    update_sales_type_backend(invoice_number, updated_sales_type)  # Pass invoice_number and updated_sales_type to backend update function
                    update_table(selected_row_index, 4, updated_sales_type, window['-TABLE-'])
                    # Update the table selection to the next row
                    if selected_row_index + 1 < len(window['-TABLE-'].Values):
                        next_row_index = selected_row_index + 1
                        window['-TABLE-'].update(select_rows=[next_row_index])
                window['-SALES_TYPE-'].update(value='')  # Clear the sales type input field after updating
                window['-SALES_TYPE_SUGGESTIONS-'].update(visible=False)
                # Move cursor to the sales type input box
                window['-SALES_TYPE-'].set_focus()
        elif event == 'Update Customer' and selected_row:
            selected_row_index = selected_row[0]
            selected_data = window['-TABLE-'].get()[selected_row_index]
            print(f"Right-click Update Customer for Invoice Number: {selected_data[1]} at index: {selected_row_index}")
            update_dialog(selected_data, selected_row_index, window['-TABLE-'])

    window.close()
    
# Define the global variables for the calendar and MC group code entry
closing_stock_calendar = None
selected_mc_group = None  # Declare selected_mc_group as global

def delete_all_closing_stock_data():
    conn = None
    try:
        conn = sqlite3.connect('local_db.db')
        cursor = conn.cursor()

        cursor.execute("DELETE FROM BusyClosingStock")
        conn.commit()
        print("All data from the BusyClosingStock table has been deleted.")

    except sqlite3.Error as e:
        print("SQLite error (delete_all_closing_stock_data):", e)
        if conn:
            conn.rollback()
    except Exception as e:
        print("An error occurred:", str(e))
    finally:
        if conn:
            conn.close()

def update_stock():
    global closing_stock_calendar, selected_mc_group, selected_busy_stock_group, selected_mc_code, busy_stock_group_values,fetch_and_print_names

    # API request for MC Group data
    mc_api_url = "http://localhost:981/"
    mc_headers = {
        "SC": "1",
        "Qry": "select A.Code as MCCode, A.Name as MCName,A.Parentgrp as MCgroupcode,b.name as MCGroupName  from Master1 A inner join Master1 B On B.code=A.ParentGrp  where B.MasterType=10",
        "UserName": "fawz",
        "Pwd": "fawz@52"
    }

    # API request for Busy Stock Group data
    busy_stock_api_url = "http://localhost:981/"
    busy_stock_headers = {
        "SC": "1",
        "Qry": "SELECT A.code,A.Name,A.Parentgrp,CASE WHEN A.ParentGrp = 0 THEN 'NoParentGroupSelect' ELSE B.Name END AS ParentGroupName FROM master1 A LEFT JOIN master1 B ON B.Code = A.ParentGrp WHERE A.MasterType = 5",
        "UserName": "fawz",
        "Pwd": "fawz@52"
    }
    

 
    try:
        # API request for MC Group
        mc_response = requests.post(mc_api_url, headers=mc_headers)

        if mc_response.status_code == 200:
            conn = sqlite3.connect('local_db.db')
            cursor = conn.cursor()

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS mc_groups (
                    MCCode TEXT,
                    MCName TEXT UNIQUE,
                    MCgroupcode TEXT,
                    MCGroupName Text
                )
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS BusyClosingStock (
                    ItemCode TEXT DEFAULT NULL,
                    My_Product TEXT DEFAULT NULL,
                    brand TEXT DEFAULT NULL,
                    category TEXT DEFAULT NULL,
                    MOQ TEXT DEFAULT NULL,
                    rack_no TEXT DEFAULT NULL,
                    MCCode TEXT DEFAULT NULL,
                    size TEXT DEFAULT NULL,
                    color TEXT DEFAULT NULL,
                    sale_price TEXT DEFAULT NULL,
                    discount TEXT DEFAULT NULL,
                    ClosingStock FLOAT DEFAULT NULL,
                    TotalAmount FLOAT DEFAULT NULL,
                    EndDate DATE DEFAULT NULL,
                    MRP Integer Null,
                    EanCode TEXT DEFAULT NULL,
                    IsSync TEXT DEFAULT NULL
                )
            """)

            xml_response = mc_response.text
            root = ET.fromstring(xml_response)

            # Mapping data for 'mc_groups' table
            mc_group_data = []

            for row in root.findall('.//z:row', namespaces={'z': '#RowsetSchema'}):
                MCCode = row.get('MCCode')
                MCName = row.get('MCName')
                MCgroupcode = row.get('MCgroupcode')
                MCGroupName = row.get('MCGroupName')

                # Append data to mc_group_data as a tuple
                mc_group_data.append((MCCode, MCName, MCgroupcode, MCGroupName))

                # Delete existing data from the 'MCgroup' table
                cursor.execute("DELETE FROM mc_groups")

            # Insert the data into the 'mc_groups' table
            try:
                cursor.executemany("INSERT OR IGNORE INTO mc_groups (MCCode, MCName, MCgroupcode,MCGroupName) VALUES (?, ?, ?, ?)", mc_group_data)
                conn.commit()
                print("MC groups fetched and stored successfully.")
            except sqlite3.Error as e:
                print("SQLite error (MC groups):", e)
                conn.rollback()

            conn.close()

        else:
            print("MC Group API request failed with status code:", mc_response.status_code)

        # API request for Busy Stock Group
        busy_stock_response = requests.post(busy_stock_api_url, headers=busy_stock_headers)

        if busy_stock_response.status_code == 200:
            # Print the API response for Busy Stock Group
            print("Busy Stock Group API response:")
            print(busy_stock_response.text)  # This line prints the response content

            conn = sqlite3.connect('local_db.db')
            cursor = conn.cursor()

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS BusyStockGroups (
                    code TEXT UNIQUE,
                    name TEXT,
                    ParentGrp INTEGER,
                    ParentGroupName TEXT
                )
            """)

            xml_response = busy_stock_response.text
            root = ET.fromstring(xml_response)

            # Mapping data for 'BusyStockGroups' table
            busy_stock_group_data = []

            for row in root.findall('.//z:row', namespaces={'z': '#RowsetSchema'}):
                code = row.get('code')
                name = row.get('Name')
                ParentGrp = row.get('Parentgrp')
                ParentGroupname =row.get('ParentGroupName')

                              

                # Append data to busy_stock_group_data as a tuple
                busy_stock_group_data.append((code, name, ParentGrp, ParentGroupname))

             # Delete existing data from the 'BusyStockGroups' table
                cursor.execute("DELETE FROM BusyStockGroups")
                           

            # Insert the data into the 'BusyStockGroups' table
            try:
                cursor.executemany("INSERT OR IGNORE INTO BusyStockGroups (code, name, ParentGrp, ParentGroupname) VALUES (?, ?, ?, ?)", busy_stock_group_data)
                conn.commit()
                print("Busy Stock Groups fetched and stored successfully.")
            except sqlite3.Error as e:
                print("SQLite error (Busy Stock Groups):", e)
                conn.rollback()
    
            conn.close()

        else:
            print("Busy Stock Group API request failed with status code:", busy_stock_response.status_code)

    except Exception as e:
        print("An error occurred:", str(e))

   
    # Create the "Update Stock" window
    update_stock_window = tk.Toplevel(main_window)
    update_stock_window.title("Update Stock")
    update_stock_window.geometry("1500x700")

    # Closing Stock Date Label and Calendar
    closing_stock_label = tk.Label(update_stock_window, text="Closing Stock Date:")
    closing_stock_label.pack(padx=20, pady=20)

    closing_stock_calendar = DateEntry(update_stock_window, date_pattern='yyyy-mm-dd')
    closing_stock_calendar.pack()

    # Create a text label for the Material Center Group dropdown
    mc_group__label = tk.Label(update_stock_window, text="Material Center Group:")
    mc_group__label.pack(padx=10, pady=10)

    # Create a StringVar to store the selected MC group name
    selected_mc_group = tk.StringVar()

    # Create a dropdown menu for MC group names
    mc_group_dropdown = tk.OptionMenu(update_stock_window, selected_mc_group, "")
    mc_group_dropdown.pack()

    # Create a text widget to display the selected MC data
    selected_mc_code = tk.StringVar()
    mc_data_label = tk.Label(update_stock_window, textvariable=selected_mc_code)
    mc_data_label.pack()


    # Create an Entry widget for filtering
    filter_entry = tk.Entry(update_stock_window)
    filter_entry.pack()

    # Define a global variable for the Busy Stock Group dropdown
    selected_busy_stock_group = tk.StringVar()
    selected_busy_stock_group.set("")  # Set the initial value to an empty string

    # Create a Busy Stock Group dropdown
    busy_stock_group_dropdown = tk.OptionMenu(update_stock_window, selected_busy_stock_group, "Select a Busy Stock Group")
    busy_stock_group_dropdown.pack()

    # Update the global variable
    fetch_and_print_names = tk.StringVar()
    
    # Bind the fetch_and_print_names function to the <Configure> event of the dropdown
    busy_stock_group_dropdown.bind('<Configure>', lambda e: fetch_and_print_names(selected_busy_stock_group.get()))

    
    # Create a Submit button
    submit_button = tk.Button(update_stock_window, text="Submit", command=submit_data)
    submit_button.pack()

    


# Function to update the MC group dropdown
    def update_mc_group_dropdown(event=None):
         try:
            # Connect to the local SQLite database
            conn = sqlite3.connect('local_db.db')
            cursor = conn.cursor()

            # Fetch unique MC group names and their corresponding MC codes from the database
            cursor.execute("SELECT DISTINCT MCGroupName FROM mc_groups")
            mc_group_names = [row[0] for row in cursor.fetchall()]
            mc_group_names.sort(key=lambda x: x.lower())  # Sort by name (case-insensitive)

            conn.close()

            # Set the default value to "Patti Bazaar"
            selected_mc_group.set("Patti Bazaar")  # Set the default value

            # Clear existing options and repopulate based on the fetched data
            mc_group_dropdown['menu'].delete(0, 'end')  # Clear existing options

            for name in mc_group_names:
                mc_group_dropdown['menu'].add_command(label=name, command=lambda n=name: selected_mc_group.set(n))

            # Callback function to fetch MC code when MC group selection changes
            def on_mc_group_change(*args):
                fetch_mc_code()  # Always fetch the MC code

            # Bind the callback to the selected MC group variable
            selected_mc_group.trace_add("write", on_mc_group_change)

            # Set the default value to "Patti Bazaar" and trigger the callback
            selected_mc_group.set("Patti Bazaar")
            
         except sqlite3.Error as e:
            print(f"Error while updating MC group dropdown: {e}")

            
    
    # Function to fetch MC code
    def fetch_mc_code():
        selected_mc_group_name = selected_mc_group.get()
        if selected_mc_group_name:
            try:
                # Connect to the local SQLite database
                conn = sqlite3.connect('local_db.db')
                cursor = conn.cursor()

                # Execute the SQL query to fetch the MCCode for the selected MCGroupName
                cursor.execute("SELECT MCCode FROM mc_groups WHERE MCGroupName=?", (selected_mc_group_name,))
                mc_data_entries = cursor.fetchall()

                # Close the database connection
                conn.close()

                if mc_data_entries:
                  # Extract and format MCCode values with OR
                   mc_codes = [str(entry[0]) for entry in mc_data_entries]
                   mc_code_filter = " OR MCCode= ".join(mc_codes)
                   selected_mc_code.set(mc_code_filter)
                   # Print the fetched MC code for debugging
                   print(f"Fetched MC code for '{selected_mc_group_name}': {mc_code_filter}")
                else:
                    # Handle the case where no data entries were found
                    selected_mc_code.set("No data entries found")

            except sqlite3.Error as e:
                print(f"Error while fetching MC code: {e}")
        else:
            # Handle the case where no MCGroupName is selected
            selected_mc_code.set("Select an MCGroupName")


    # Call the update_mc_group_dropdown function to set the default value and populate the dropdown
    update_mc_group_dropdown()
    

    
    def update_busy_stock_group_dropdown():
    # Connect to the local SQLite database
        conn = sqlite3.connect('local_db.db')
        cursor = conn.cursor()

    # Fetch Busy Stock Group names from the database
        cursor.execute("SELECT DISTINCT ParentGroupName FROM BusyStockGroups")
        busy_stock_group_values = [row[0] for row in cursor.fetchall()]
        busy_stock_group_values.sort(key=lambda x: x.lower())  # Sort by name (case-insensitive)
        
        conn.close()

     # Clear the previous selection
        selected_busy_stock_group.set("FAWZ")  # Set the default value

    # Clear existing options and repopulate based on the filter
        search_term = filter_entry.get().lower()
        busy_stock_group_dropdown['menu'].delete(0, 'end')

        for name in busy_stock_group_values:
            if search_term in name.lower():
                busy_stock_group_dropdown['menu'].add_command(label=name, command=lambda c=name: selected_busy_stock_group.set(c))

     # Create a button to update the dropdown
    update_button = tk.Button(update_stock_window, text="Refresh Dropdown", command=update_busy_stock_group_dropdown)
    update_button.pack()

    # Call the update_busy_stock_group_dropdown function to populate the Busy Stock Group dropdown
    update_busy_stock_group_dropdown()

    # Function to fetch MC code
    def fetch_and_print_names(selected_parent_group_name):
        names = []  # Initialize an empty list to store names
        if selected_parent_group_name:
            try:
                # Connect to the local SQLite database
                conn = sqlite3.connect('local_db.db')
                cursor = conn.cursor()

                # Execute the SQL query to fetch all names for the selected ParentGroupName
                cursor.execute("SELECT name FROM BusyStockGroups WHERE ParentGroupName = ? OR ParentGroupName IN (SELECT name FROM BusyStockGroups WHERE ParentGroupName = ? OR ParentGroupName IN (SELECT name FROM BusyStockGroups WHERE ParentGroupName = ? OR ParentGroupName IN (SELECT name FROM BusyStockGroups WHERE ParentGroupName = ?)))", (selected_parent_group_name, selected_parent_group_name, selected_parent_group_name, selected_parent_group_name))
                
                name_data_entries = cursor.fetchall()
                # Close the database connection
                conn.close()

                if name_data_entries:
                    # Extract and format names
                    names = [str(entry[0]) for entry in name_data_entries]
                    names_str = "\n".join(names)
                    
                else:
                    # Handle the case where no data entries were found
                    print("No data entries found")

            except sqlite3.Error as e:
                print(f"Error while fetching parent group name: {e}")
        else:
            # Handle the case where no ParentGroupName is selected
            print("Select a ParentGroupName")
        return names  # Return the list of names

def submit_data():
    try:
        # Get the selected closing stock date and MC group code
        selected_date = closing_stock_calendar.get_date()
        selected_mc_group_code = selected_mc_code.get()  # Retrieve the code from the StringVar
        selected_parent_group_name = selected_busy_stock_group.get()  # Retrieve the stock group name
        print("Selected Parent Group Name:", selected_parent_group_name)
        print("Selected MC Group Code:", selected_mc_group_code)

        # Fetch the list of names associated with the selected parent group
        names = fetch_and_print_names(selected_parent_group_name)

        # Check if both date and MC group code are selected
        if selected_date and selected_mc_group_code:
            # Parse the selected_date in the 'yyyy-mm-dd' format
            parsed_date = datetime.strptime(selected_date.strftime('%Y-%m-%d'), '%Y-%m-%d')
            
           # Preprocess the selected_mc_group_code to remove extra characters and get values
            mc_group_codes = selected_mc_group_code.strip()

            # Generate the SQL query with the correct MCCode filtering
            mc_code_filter = f"AND (MCCode = {mc_group_codes})"

            # Modify the SQL query to use the parsed date and MC group code as filters
            name_conditions = " OR ".join([f"C.NAME = '{name}'" for name in names])
            
            # Modify the SQL query to use the parsed date and MC group code as filters
            sql_query = f"""Select H.Alias as ItemCode, B.name AS My_Product, c.name AS brand, G.Name AS category,CASE WHEN CHARINDEX('@', D.OF2) > 0 THEN SUBSTRING(REPLACE(D.OF2, '@', ''),PATINDEX('%[^0]%', REPLACE(D.OF2, '@', '')), LEN(REPLACE(D.OF2, '@', ''))) ELSE REPLACE(D.OF2, '0', '') END AS MOQ, E.name AS rack_no, STRING_AGG(MCCode, ',') AS MCCode,CASE WHEN C.name LIKE '%Campus%' THEN A.C1 ELSE A.C2 END AS size,CASE WHEN C.name LIKE '%Campus%' THEN A.C2 ELSE A.C1 END AS color, b.d3 AS sale_price,b.d16 AS discount, SUM(Value1) AS ClosingStock, SUM(A.D7) AS TotalAmount,'{selected_date}' AS EndDate,A.D3 as MRP,A.C3 as EanCode FROM ItemParamDet A INNER JOIN master1 B ON A.itemcode = B.code INNER JOIN master1 C ON B.ParentGrp = C.code INNER JOIN MasterAddressInfo D ON A.ItemCode = D.MasterCode INNER JOIN master1 E ON D.OF1 = E.Code INNER JOIN MasterSupport F ON B.Code = F.MasterCode INNER JOIN Master1 G ON F.CM1 = G.Code inner join Master1 H on h.Code=a.ItemCode WHERE F.SrNo = 1 and F.Date <= '{selected_date}' {mc_code_filter} AND ({name_conditions}) and A.RecType= 1 and f.RecType=110 GROUP BY B.name, h.Alias, c.name, A.C5, D.OF2, E.name, G.Name,A.C1, A.C2,A.C3, A.C8, A.C9, b.d16, b.d3,A.d3 ORDER BY ItemCode,A.C1, A.C2,A.C3"""
            
            # Print the SQL query for debugging
            print("SQL Query:")
            print(sql_query)

            # Now, you can use the modified SQL query in your API request
            other_api_url = "http://localhost:981/"
            other_api_headers = {
                "SC": "1",
                "Qry": sql_query,
                "UserName": "fawz",
                "Pwd": "fawz@52"
            }

            # Send a request to the other API with the selected data
            other_api_response = requests.get(other_api_url, headers=other_api_headers)
            # Log the request details (including headers and content)
            print("Request Details:")
            print(f"Request URL: {other_api_response.url}")
            print(f"Request Headers: {other_api_response.request.headers}")
            print(f"Request Content: {other_api_response.request.body}")

            if other_api_response.status_code == 200:
               response_text = other_api_response.text
               print("Data submitted successfully to the other API.")
               print("API Response:")
               print(response_text)  # Print the API response text

                    # Parse the XML response
               root = ET.fromstring(response_text)

                    # Delete previous data from the "BusyClosingStock" table
               conn = sqlite3.connect('local_db.db')
               cursor = conn.cursor()
               cursor.execute("DELETE FROM BusyClosingStock")
               conn.commit()

               for row in root.findall('.//z:row', namespaces={'z': '#RowsetSchema'}):
                    ItemCode = row.get('ItemCode')
                    My_Product = row.get('My_Product')
                    brand = row.get('brand')
                    category = row.get('category')
                    MOQ = row.get('MOQ')
                    rack_no = row.get('rack_no')
                    MCCode = row.get('MCCode')
                    size = row.get('size')
                    color = row.get('color')
                    sale_price = row.get('sale_price')
                    discount = row.get('discount')
                    ClosingStock = row.get('ClosingStock')
                    TotalAmount = row.get('TotalAmount')
                    EndDate = row.get('EndDate')
                    MRP = row.get('MRP')
                    EanCode= row.get('EanCode')

                    # Debugging output for each row
                    print(f"Inserting row: {ItemCode}, {My_Product}, {brand}, {category}, {MOQ}, {rack_no}, {MCCode}, {size}, {color}, {sale_price}, {discount}, {ClosingStock}, {TotalAmount}, {EndDate}, {MRP}, {EanCode}")

                    cursor.execute("""
                        INSERT INTO BusyClosingStock (ItemCode, My_Product, brand, category, MOQ, rack_no, MCCode, size, color, sale_price, discount, ClosingStock, TotalAmount, EndDate, MRP, EanCode)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (ItemCode, My_Product, brand, category, MOQ, rack_no, MCCode, size, color, sale_price, discount, ClosingStock, TotalAmount, EndDate, MRP, EanCode))

               conn.commit()
               conn.close()

               print("Data inserted into the local database (BusyClosingStock).")

            
            # Fetch data from the BusyClosingStock table
            conn = sqlite3.connect('local_db.db')
            cursor = conn.cursor()
            cursor.execute("""
                SELECT DISTINCT
                A.My_Product AS name,
                A.ItemCode AS code,
                Case when C.ParentGroupName IN ('FAWZ', 'NoParentGroupSelect') THEN C.name 
                ELSE C.ParentGroupName
                END AS brand,
                B.Itemcategory,
                A.MOQ,
                A.rack_no,
                A.MCCode,
                A.color,  
                A.size,
                A.sale_price,
                A.discount,
                A.ClosingStock AS quantity,
                A.MRP,
                A.EanCode,
                '' AS image  -- You can set image to an empty string or fetch it from another source
                FROM
                BusyClosingStock A inner join stock_items B on a.ItemCode=b.Alias
                inner join BusyStockGroups C on C.name=A.brand""")

            fetched_data = cursor.fetchall()

                # Create a new table for fetched data
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS FetchedData (
                    My_Product TEXT,
                    ItemCode TEXT,
                    brand TEXT,
                    Itemcategory TEXT,
                    MOQ TEXT,
                    rack_no TEXT,
                    MCCode TEXT,
                    color TEXT,
                    size TEXT,
                    sale_price REAL,
                    discount REAL,
                    ClosingStock REAL,
                    MRP integer DEFAULT NULL,
                    EanCode TEXT DEFAULT NULL,
                    Image REAL
                    )
            """)

            # Delete previous data from the "FetchedData" table
            conn = sqlite3.connect('local_db.db')
            cursor = conn.cursor()
            cursor.execute("DELETE FROM FetchedData")
            conn.commit()

            # Insert the fetched data into the FetchedData table
            cursor.executemany("""
                INSERT INTO FetchedData VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, fetched_data)

            conn.commit()
            conn.close()

            print("Data inserted into the local database (FetchedData).")

            
                # Display the closing stock data in a new PySimpleGUI window
            display_closing_stock(root)
        else:
                    print("Failed to submit data to the other API. Status Code:", other_api_response.status_code)
            
    except Exception as e:
        print("An error occurred:", str(e))

def fetch_data_from_local_db():
    conn = None
    try:
        conn = sqlite3.connect('local_db.db')
        cursor = conn.cursor()

        cursor.execute(""" WITH LatestMRP AS (
    SELECT 
        ItemCode,
        color,
        size,
        eancode,
        MAX(MRP) AS MaxMRP
    FROM 
        BusyClosingStock
    GROUP BY 
        ItemCode, color, size, eancode
),
MergedStock AS (
    SELECT
        A.ItemCode,
        A.color,
        A.size,
        A.eancode,
        L.MaxMRP,
        SUM(A.ClosingStock) AS TotalClosingStock
    FROM 
        BusyClosingStock A
        INNER JOIN LatestMRP L 
            ON A.ItemCode = L.ItemCode 
            AND A.color = L.color 
            AND A.size = L.size 
            AND A.eancode = L.eancode
    GROUP BY
        A.ItemCode, A.color, A.size, A.eancode, L.MaxMRP
)
SELECT DISTINCT
    A.My_Product AS name,
    A.ItemCode AS code,
    CASE 
        WHEN C.ParentGroupName IN ('FAWZ', 'NoParentGroupSelect') THEN C.name 
        ELSE C.ParentGroupName 
    END AS brand,
    B.Itemcategory,
    A.MOQ,
    A.rack_no,
    A.MCCode,
    A.color,  
    A.size,
    CASE 
        WHEN B.StockGroupname LIKE '%Campus%' THEN MS.MaxMRP 
        ELSE B.SalePrice
    END AS SalePrice,
    A.discount,
    MS.TotalClosingStock AS quantity,
    '' AS image,
    ROUND(1.0 / CAST(B.ConversionFactor AS DECIMAL(18,10))) AS PRCTN,
    CAST(LTRIM(REPLACE(B.points, '@', '')) AS INT) AS points
FROM
    FetchedData A
    INNER JOIN stock_items B ON A.ItemCode = B.Alias
    INNER JOIN BusyStockGroups C ON C.name = A.brand
    INNER JOIN MergedStock MS ON MS.ItemCode = A.ItemCode AND MS.color = A.color AND MS.size = A.size AND MS.eancode = A.eancode
WHERE
    A.ItemCode IS NOT NULL AND A.ItemCode <> '';

        """)

        data = cursor.fetchall()
        return data
    except sqlite3.Error as e:
        print("SQLite error (fetch_data_from_local_db):", e)
    except Exception as e:
        print("An error occurred:", str(e))
    finally:
        if conn:
            conn.close()

    
# Function to send data to the remote API with Authorization header
def send_data_to_web(data):
    api_url = "https://admin.fawz.in/api/v1/products/import"
    headers = {
        "Authorization": "Bearer BOOT@QazWsx@API123",
        "Content-Type": "application/json"
    }

    try:
        # Print the input request data before sending it
        print("\nInput Request Data:")
        print(json.dumps(data, indent=4))  # Pretty-print the JSON data

        # Send all the data to the API in one request
        response = requests.post(api_url, json=data, headers=headers)

        if response.status_code == 200:
            print("\nData successfully sent to the API.")
            print("API Response:")
            print(response.text)
            sg.popup("Data uploaded successfully", title="Success")
        else:
            print("\nFailed to send data to the API. Status Code:", response.status_code)
            print("API Error Response:")
            print(response.text)  # Print the error response from the API
            sg.popup_error("Failed to sync data to the web. Please check the logs for details.", title="Error")
    except Exception as e:
        print("\nAn error occurred while sending data to the API:", str(e))
        sg.popup_error("Failed to sync data to the web. Please check the logs for details.", title="Error")

# Function to display the closing stock data and sync it to the web
def display_closing_stock(root):
    # Create a layout for the PySimpleGUI window
    layout = [
        [sg.Table(values=[], headings=['ItemCode', 'My_Product', 'brand', 'category','MOQ','Rackno','MCCode', 'Color', 'Size', 'SalePrice','Discount','ClosingQTY'],
                   auto_size_columns=False, justification='Center', num_rows=35, col_widths=[13, 12, 14, 24, 10, 12, 10, 10, 10, 10, 10, 10],
                   text_color='black', background_color='lightblue')],
        [sg.Button('Close'), sg.Button('Sync to Web')],
    ]

    # Create the PySimpleGUI window with specified size and enable the maximize button
    window = sg.Window('Closing Stock Data', layout, finalize=True, size=(1500, 700), resizable=True)

    # Change the background color of the layout (window)
    window.TKroot.configure(background='white')  # Change 'lightgreen' to your desired color

    # Fetch data from the local database
    data = fetch_data_from_local_db()

    # Update the table with the data
    table = window[0]
    table.update(values=data)

    while True:
        event, values = window.read()
        if event == sg.WINDOW_CLOSED or event == 'Close':
            break
        elif event == 'Sync to Web':
            # Fetch data from the local database
            local_db_data = fetch_data_from_local_db()

            # Map the fetched data to the desired format and send it to the API
            if local_db_data:
                mapped_data = []
                for row in local_db_data:
                    mapped_data.append({
                        "name": row[0],
                        "code": row[1],
                        "brand": row[2],
                        "category": row[3],
                        "MOQ": row[4],
                        "rack_no": row[5],
                        "color": row[7],
                        "size": row[8],
                        "sale_price": row[9],
                        "discount": row[10],
                        "quantity": row[11],
                        "image": '',
                        "PRCTN": row[13],
                        "points": row[14],
                    })

                # Call the send_data_to_web function with the mapped data
                send_data_to_web(mapped_data)
                # Export data to Excel
                df = pd.DataFrame(local_db_data, columns=['ItemCode', 'My_Product', 'brand', 'category', 'MOQ', 'Rackno', 'MCCode', 'Color', 'Size', 'SalePrice', 'Discount', 'ClosingQTY', 'Image', 'PRCTN', 'points'])
                df.to_excel("closing_stock.xlsx", index=False)
                print("Data exported to 'closing_stock.xlsx'")
            else:
                print("No data found in the local database.")
                            
    window.close()  # Close the window after the loop

# Fetch data from the local database
local_db_data = fetch_data_from_local_db()

# If there is no local data, display a message
if not local_db_data:
    print("No data found in the local database.")

    
def fetch_sales_orders():
    # Get the start and end dates from the DateEntry widgets
    start_date = start_date_calendar.get_date()
    end_date = end_date_calendar.get_date()

    # Check if start date and end date are valid
    if start_date is not None and end_date is not None:
        # Format the dates as required by the API (you may need to adjust the format)
        start_date_str = start_date.strftime("%Y-%m-%d")
        end_date_str = end_date.strftime("%Y-%m-%d")

        # Define the API URL
        api_url = "https://admin.fawz.in/api/v1/orders"

        # Define the headers with the authorization token
        headers = {
            "Authorization": "Bearer BOOT@QazWsx@API123"
        }

        # Construct the full URL (with query parameters)
        full_url = f"{api_url}?fromDate={start_date_str}&toDate={end_date_str}"

        # Print the API URL for reference
        print("API URL:", full_url)

        # Make the API request
        try:
            response = requests.get(full_url, headers=headers)

            # Check the response status code and process the data as needed
            if response.status_code == 200:
                # Process the response data here
                data = response.json()

                # Store the JSON response in a local JSON file
                with open('sales_orders.json', 'w') as json_file:
                    json.dump(data, json_file)

                # Connect to the SQLite database (or create a new one if it doesn't exist)
                conn = sqlite3.connect('local_db.db')
                cursor = conn.cursor()

                # Create a table to store the sales orders
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS sales_orders (
                        _id TEXT PRIMARY KEY,
                        order_id TEXT,
                        name TEXT,
                        shop_name TEXT,
                        transport_name TEXT,
                        isd TEXT,
                        mobile TEXT,
                        city TEXT,
                        subtotal INTEGER,
                        discount INTEGER,
                        total INTEGER,
                        remark TEXT,
                        status TEXT,
                        batch_id TEXT,
                        updated_at TEXT,
                        created_at TEXT,
                        IsSync TEXT DEFAULT NULL  -- New column with default value NULL
                    )
                """)

                # Create a table to store the items
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS order_items (
                        order_id TEXT,
                        size TEXT,
                        MOQ INTEGER,
                        price REAL,
                        qty INTEGER,
                        color TEXT,
                        code TEXT,
                        comment TEXT,
                        total REAL,
                        FOREIGN KEY (order_id) REFERENCES sales_orders (_id)
                    )
                """)

                # Iterate through the "data" array and insert each sales order and its items into the database
                for record in data.get("data", []):
                    try:
                        # Validate and sanitize the discount field
                        discount_value = record.get("discount", 0)
                        if not isinstance(discount_value, int):
                            discount_value = 0

                        sales_order_values = (
                            record["_id"],
                            record["order_id"],
                            record["name"],
                            record["shop_name"],
                            record["transport_name"],
                            record["isd"],
                            record["mobile"],
                            record["city"],
                            record["subtotal"],
                            discount_value,  # Use the validated discount value
                            record["total"],
                            record["remark"],
                            record["status"],
                            record["batch_id"],
                            record["updated_at"],
                            record["created_at"]
                        )                        

                        # Insert the sales order
                        cursor.execute("""
                            INSERT INTO sales_orders
                            (_id, order_id, name, shop_name, transport_name, isd, mobile, city,
                            subtotal, discount, total, remark, status, batch_id, updated_at, created_at)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """, sales_order_values)

                        # Insert the items for this sales order
                        for item in record.get("items", []):
                            comment_value = item.get("comment")

                            order_item_values = (
                                record["order_id"],
                                item["size"],
                                item["MOQ"],
                                item["price"],
                                item["qty"],
                                item["color"],
                                item["code"],
                                comment_value,  # Use the 'comment' value (or None)
                                item["total"]
                            )
                            
                            cursor.execute("""
                                INSERT INTO order_items
                                (order_id, size, MOQ, price, qty, color, code, comment, total)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """, order_item_values)

                        # Commit the changes for each record
                        conn.commit()

                    except Exception as e:
                        # Handle the exception (print an error message, log the error, etc.)
                        print(f"Error while inserting data: {e}")
                        # Rollback the transaction to avoid partial data insertion
                        conn.rollback()

                # Close the database connection
                conn.close()

            else:
                print(f"API request failed with status code {response.status_code}")

        except Exception as e:
            print(f"An error occurred: {e}")

def make_order_stock_api_call():
    Order_Stock_url = "http://localhost:981/"
    Stock_query = """WITH RankedItems AS (SELECT B.Alias AS Itemcode, A.C1 AS Color, A.C2 AS Size, A.C3 AS Eancode, A.D3 AS MRP, A.Value1 AS Qty,ROW_NUMBER() OVER (PARTITION BY A.ItemCode, A.C1, A.C2 ORDER BY A.Value1 DESC) AS RowNum FROM ItemParamDet A INNER JOIN master1 B ON B.code = A.ItemCode)SELECT Itemcode, Size, Color, Eancode, MRP, Qty FROM RankedItems WHERE RowNum = 1;"""

    OrderStock_api_headers = {
        "SC": "1",
        "Qry": Stock_query,
        "UserName": "fawz",
        "Pwd": "fawz@52"
    }

    try:
        # API request for MC Group
        Order_stock_response = requests.post(Order_Stock_url, headers=OrderStock_api_headers)

        if Order_stock_response.status_code != 200:
            print(f"API request failed with status code: {Order_stock_response.status_code}")
            return

        conn = sqlite3.connect('local_db.db')
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS SOCLosingStock (
                Itemcode TEXT,
                Size TEXT ,
                Color TEXT,
                Eancode Text,
                MRP integer,
                Qty integer
            )
        """)

        xml_response = Order_stock_response.text
        root = ET.fromstring(xml_response)

        # Delete existing data from the 'SOCLosingStock' table
        cursor.execute("DELETE FROM SOCLosingStock")

        # Mapping data for 'SOCLosingStock' table
        SOCLosingStock_data = []

        for row in root.findall('.//z:row', namespaces={'z': '#RowsetSchema'}):
            Itemcode = row.get('Itemcode')
            Size = row.get('Size')
            Color = row.get('Color')
            Eancode = row.get('Eancode')
            MRP = row.get('MRP')
            Qty = row.get('Qty')

            # Append data to SOCLosingStock_data as a tuple
            SOCLosingStock_data.append((Itemcode, Size, Color, Eancode, MRP, Qty))

        # Insert data from API response into the table
        for item in SOCLosingStock_data:
            cursor.execute("INSERT INTO SOCLosingStock VALUES (?, ?, ?, ?, ?, ?)", item)

        # Commit the changes and close the connection
        conn.commit()
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

def create_sale_order():
    make_order_stock_api_call()  # Make the API call before creating the Tkinter window
    
    view_order_window = tk.Toplevel(main_window)
    view_order_window.title("Create Sale Order")

    # Set the size of the view_order_window to 1500x800
    view_order_window.geometry("1500x800")

    # Create a label for start date
    start_date_label = tk.Label(view_order_window, text="Start Date:")
    start_date_label.pack()

    # Create a DateEntry widget for start date selection
    global start_date_calendar  # Declare as global
    start_date_calendar = DateEntry(view_order_window)
    start_date_calendar.pack()

    # Create a label for end date
    end_date_label = tk.Label(view_order_window, text="End Date:")
    end_date_label.pack()

    # Create a DateEntry widget for end date selection
    global end_date_calendar  # Declare as global
    end_date_calendar = DateEntry(view_order_window)
    end_date_calendar.pack()

    fetch_button = tk.Button(view_order_window, text="Fetch Sales Orders", command=fetch_sales_orders)
    fetch_button.pack(pady=10)

    # Create a new button "View Order" to the right of "Fetch Sales Orders"
    View_and_create_order_button = tk.Button(view_order_window, text="View and create order", command=View_and_create_order_action)
    View_and_create_order_button.pack(pady=10)



# Define a function to send the API request
def send_api_request(xml_payload):
    # Define the API URL
    api_url = "http://localhost:981/"

    # Define the headers
    headers = {
        "SC": "2",
        "VchType": "12",
        "VchXML": xml_payload,
        "UserName": "fawz",
        "Pwd": "fawz@52"
    }

    try:
        # Send the POST request to the API
        response = requests.post(api_url, headers=headers)

        # Check the response status code
        if response.status_code == 200:
            return response.headers, response.text  # Return the response content (body)
        else:
            return {}, f"API Request Failed: {response.text}"
    except Exception as e:
        return {},f"API Request Error: {str(e)}"

def View_and_create_order_action():      

    conn = None  # Initialize the database connection

    try:
        # Connect to the SQLite database
        conn = sqlite3.connect('local_db.db')
        cursor = conn.cursor()

        # SQL JOIN query to fetch sales order and item details
        cursor.execute("""
        SELECT DISTINCT
        so.order_id,
        strftime('%d-%m-%Y', date(so.created_at)) AS formatted_created_at,
        so.name,
        CASE WHEN so.shop_name GLOB '*[^A-Za-z0-9 "''\\/.:@#$%^&*()]*' THEN NULL ELSE so.shop_name END AS shop_name,
        so.transport_name,
        CASE WHEN si.StockGroupname LIKE '%Campus%' THEN oi.size ELSE oi.color END AS size,
        CASE WHEN si.StockGroupname LIKE '%Campus%' THEN oi.color ELSE oi.size END AS color,
        oi.code,
        si.SalePrice,
        oi.qty,
        (oi.qty * si.SalePrice) - (oi.qty * si.SalePrice * si.discount / 100) AS Amt,
        so.IsSync,
        oi.total AS item_total,     
        so.total,
        so.status,
        so.mobile,
        so.city,
        oi.MOQ,
        si.discount,
        SUBSTR(oi.comment, 1, 30) AS comment,
        SUBSTR(so.remark, 1, 30) AS remark,
        si.StockGroupname,
        si.SalePrice - (si.SalePrice * si.discount / 100) AS price,
        COALESCE(soc.MRP, '') AS MRP,
        COALESCE(soc.Eancode, '') AS Eancode
        FROM 
        sales_orders AS so
        INNER JOIN 
        order_items AS oi ON so.order_id = oi.order_id
        INNER JOIN 
        stock_items AS si ON si.Alias = oi.code
        LEFT JOIN
        SOCLosingStock AS soc ON (si.StockGroupname LIKE '%Campus%'
                             AND soc.Itemcode = oi.code
                             AND soc.size = oi.color
                             AND soc.color = oi.size)
                           OR (si.StockGroupname NOT LIKE '%Campus%' AND soc.Itemcode = oi.code and soc.size=oi.size and soc.color=oi.color)
        WHERE oi.qty IS NOT NULL;
        """)
        order_info = cursor.fetchall()

        # Define the column layout for the table
        column_layout = [
            [sg.Table(values=order_info, headings=[
                "Order ID", "Order Date", "Name", "Shop Name", "Transport Name", "Size", "Color", "Code", "Price", "Qty", "Item Total", "Sync Status"
            ], auto_size_columns=False, justification='left',
            col_widths=[10, 10, 10, 20, 20, 10, 15, 10, 10, 10, 10, 10, 10, 10], enable_events=True, key='-TABLE-', num_rows=40)],
            [sg.Button('Sync Order', key='-SYNC-')]
        ]

        # Create the window with finalize=True to make adjustments
        window = sg.Window('View and Create Order', layout=column_layout, finalize=True)

        # Maximize the window
        window.Maximize()

        sync_successful = True  # Flag to track if all syncs are successful

        while True:
            event, values = window.read()

            if event == sg.WIN_CLOSED:
                break
            elif event == '-SYNC-':
                # Create a dictionary to group orders by order_id or VchNo
                orders_dict = {}

                for row in order_info:
                    order_id = row[0]  # Assuming row[0] contains the order_id or VchNo

                    if order_id not in orders_dict:
                        # Create a new SaleOrder element for this order_id or VchNo
                        orders_dict[order_id] = ET.Element("SaleOrder")

                        # Add remaining fields to the SaleOrder element
                        ET.SubElement(orders_dict[order_id], "VchSeriesName").text = "FAWZ APP"
                        ET.SubElement(orders_dict[order_id], "Date").text = str(row[1])  # Use the fixed date from the template
                        ET.SubElement(orders_dict[order_id], "VchType").text = "12"  # Change VchType to "12"
                        ET.SubElement(orders_dict[order_id], "VchNo").text = str(order_id)  # Use the order_id as VchNo
                        ET.SubElement(orders_dict[order_id], "STPTName").text = "L/GST-MultiRate"
                        ET.SubElement(orders_dict[order_id], "MasterName1").text = "Fawz"
                        ET.SubElement(orders_dict[order_id], "MasterName2").text = "Main Store"

                        # Add VchOtherInfoDetails element
                        vch_other_info_details = ET.SubElement(orders_dict[order_id], "VchOtherInfoDetails")
                        ET.SubElement(vch_other_info_details, "Narration1").text = str(row[3]) + " " + str(row[15]) + " " + str(row[16]) + " " + str(row[13]) + " " + str(row[20])

                    # Create ItemEntries element for this order_id or VchNo
                    item_entries = ET.SubElement(orders_dict[order_id], "ItemEntries")
                    item_detail = ET.SubElement(item_entries, "ItemDetail")

                    # Add remaining fields to ItemDetail element
                    ET.SubElement(item_detail, "SrNo").text = str(row[0])  # Use the order_id from the database
                    ET.SubElement(item_detail, "ItemName").text = str(row[7])
                    ET.SubElement(item_detail, "UnitName").text = "Pcs."
                    ET.SubElement(item_detail, "Qty").text = str(row[9])
                    ET.SubElement(item_detail, "AF").text = str(row[19])
                    
                    ET.SubElement(item_detail, "ListPrice").text = str(row[8])
                    ET.SubElement(item_detail, "Price").text = str(row[22])
                    ET.SubElement(item_detail, "DiscountPercent").text = str(row[18])
                    ET.SubElement(item_detail, "Amt").text = str(row[10])
                    ET.SubElement(item_detail, "STAmount").text = ""
                    ET.SubElement(item_detail, "STPercent").text = ""
                    ET.SubElement(item_detail, "STPercent1").text = ""
                    ET.SubElement(item_detail, "TaxBeforeSurcharge").text = ""
                    ET.SubElement(item_detail, "TaxBeforeSurcharge1").text = ""
                    ET.SubElement(item_detail, "MC").text = "Main Store"

                    # Add ParamStockEntries element
                    param_stock_entries = ET.SubElement(item_detail, "ParamStockEntries")
                    param_stock_details = ET.SubElement(param_stock_entries, "ParamStockDetails")

                    # Add remaining fields to ParamStockDetails element
                    ET.SubElement(param_stock_details, "Param1").text = str(row[5])
                    ET.SubElement(param_stock_details, "Param2").text = str(row[6])
                    ET.SubElement(param_stock_details, "Param3").text = str(row[24])
                    ET.SubElement(param_stock_details, "MainQty").text = str(row[9])
                    ET.SubElement(param_stock_details, "MRP").text = str(row[23])
                    ET.SubElement(param_stock_details, "MainUnitPrice").text = str(row[8])
                    ET.SubElement(param_stock_details, "Amount").text = str(row[10])

                # Convert each SaleOrder element to XML strings
                xml_payloads = [ET.tostring(order, encoding="utf-8").decode() for order in orders_dict.values()]
                print(xml_payloads)

                # Iterate through orders and send API requests
                for order_id, xml_payload in zip(orders_dict.keys(), xml_payloads):
                    # Check if IsSync is already 'Y'
                    cursor.execute("SELECT IsSync FROM sales_orders WHERE order_id = ?", (order_id,))
                    current_sync_status = cursor.fetchone()
          
                
                    if current_sync_status and current_sync_status[0] == 'Y':
                        print(f"Order {order_id} is already synced. Skipping...")
                        continue

                    # Print the API request XML payload before sending
                    print(f"Sending API Request for Order {order_id}:")
                    print(xml_payload)              

                    try:
                        response_headers, response_content = send_api_request(xml_payload)
                    except UnicodeEncodeError as e:
                        print(f"Error encoding response content for Order {order_id}: {str(e)}")
                        sync_status = 'N'
                        continue  # Skip to the next order
                        
                    # Print the API response XML payload after receiving
                    print(f"API Response for Order {order_id}:")
                    print(response_headers)

                    if not response_headers:
                        print("API Response Headers are missing. Skipping...")
                        sync_status = 'N'
                        continue

                    # Check if the 'Result' key in response headers is 'T'
                    if response_headers.get('Result') != 'T':
                        print(f"API Response for Order {order_id} does not have 'Result' set to 'T'. Skipping...")
                        sync_status = 'N'
                        continue
                    

                    if not response_content:
                    # Check if response_content is blank
                        print("API Response Headers:")
                        print(response_headers)
                        
                        print(f"API Response for Order {order_id} is blank. Skipping...")
                        continue
                    
                    if "API Request Failed" in response_content:
                        sync_status = 'N'
                        print(f"API Request Failed for Order {order_id}: {response_content}")
                        continue  # Skip to the next order

                    
                    elif response_content:
                        # Print the response content (body)
                        print("API Response Body:")
                        print(response_content)

                    # Check if the response contains a numeric digit and the HTTP status code is 200
                    if any(char.isdigit() for char in response_content) and response_headers.get('Result') == 'T':
                        sync_status = 'Y'
                    else:
                        sync_status = 'N'
                        # Print the header description when synchronization is not successful
                        print("Header Description: Your description here")
                    
                    # Update the IsSync status in the database
                    cursor.execute("UPDATE sales_orders SET IsSync = ? WHERE order_id = ?", (sync_status, order_id))
                    conn.commit()
                # Exit the loop if any sync fails
                    if sync_status == 'N':
                        break

            if sync_successful:
                    # Show a success message on the view order screen
                    sg.popup("Sale Order Sync Successful", title="Sync Result")

    except Exception as e:
        # Handle exceptions here
        sg.popup_error(f"Error: {str(e)}")

    finally:
        if conn:
            conn.close()

        if window:
            window.close()
    

        
main_window = tk.Tk()
main_window.title("User login Page")

# Get the screen width and height to set the window size
screen_width = main_window.winfo_screenwidth()
screen_height = main_window.winfo_screenheight()

# Set the window geometry to fit the screen
main_window.geometry(f"{screen_width}x{screen_height}")

main_box = tk.LabelFrame(main_window, text="User login Page", padx=20, pady=20)
main_box.pack(padx=20, pady=20, fill="both", expand=True)

label2 = tk.Label(main_box, text="Username:")
label3 = tk.Label(main_box, text="Password:")

entry2 = tk.Entry(main_box)
entry3 = tk.Entry(main_box)

submit_button = tk.Button(main_box, text="Submit", command=submit)

label2.grid(row=0, column=0, sticky="e")
label3.grid(row=1, column=0, sticky="e")

entry2.grid(row=0, column=1)
entry3.grid(row=1, column=1)

submit_button.grid(row=2, column=0, columnspan=2, pady=10)

# Create a custom style for the Separator with increased thickness
style = ttk.Style()
style.configure("Custom.TSeparator", thickness=0)  # Set thickness to 0 to remove the border

# Add company name and API integration button on the top right side
company_name_label = tk.Label(main_window, text="Web to Busy syncing Form")
company_name_label.place(x=screen_width - 300, y=10)

# Load and resize the second logo image
logo_image2 = Image.open("shoes.jpg")
logo_image2.thumbnail((800, 620))  # Use 'thumbnail' to resize
logo_photo2 = ImageTk.PhotoImage(logo_image2)

# Create a label for the second logo
logo_label2 = tk.Label(main_window, image=logo_photo2)
logo_label2.image = logo_photo2  # Keep a reference to avoid garbage collection
logo_label2.place(x=screen_width - 650, y=50)

# Create a label for displaying API integration results
result_label = tk.Label(main_box, text="", pady=10)
result_label.grid(row=4, column=0, columnspan=2)  # Position the result label

# Create a label for displaying API integration results
api_result_label = tk.Label(main_box, text="", pady=10)
api_result_label.grid(row=5, column=0, columnspan=2)  # Position the API result label

# Create a menu bar for the sub-screen
sub_menu_bar = tk.Menu(main_window)
main_window.config(menu=sub_menu_bar)

main_window.mainloop()

