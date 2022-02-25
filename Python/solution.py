import csv
import requests
import json
from types import SimpleNamespace

# READING FILE A
fileA = open('/Users/arielmira/Desktop/Piano Assessment/Python/input_files/A.csv')
csvreaderA = csv.reader(fileA)

next(csvreaderA, None)  # skip the headers

# USING A CLASS FOR THE USER DATA IN FILE A
class userA: 
    def __init__(self, user_id, email): 
        self.user_id = user_id 
        self.email = email

dataA = []
# dataA will contain all the users in the File A
for rowA in csvreaderA:
    dataA.append(userA(rowA[0],rowA[1]))

fileA.close() # close file

# READING FILE B
fileB = open('/Users/arielmira/Desktop/Piano Assessment/Python/input_files/B.csv')
csvreaderB = csv.reader(fileB)

next(csvreaderB, None)  # skip the headers

# USING A CLASS FOR THE USER DATA IN FILE B
class userB: 
    def __init__(self, user_id, first_name, last_name): 
        self.user_id = user_id 
        self.first_name = first_name
        self.last_name = last_name

dataB = []
# dataB will contain all the users in the File B
for rowB in csvreaderB:
    dataB.append(userB(rowB[0],rowB[1],rowB[2]))

fileB.close() # close file

# USING A CLASS FOR THE MERGED USERS
class mergedUsers: 
    def __init__(self, user_id, email, first_name, last_name): 
        self.user_id = user_id 
        self.email = email
        self.first_name = first_name
        self.last_name = last_name

mergedUsersData = []

# POST REQUEST TO USER'S API TO FETCH EXISTING USERS
url = 'https://sandbox.piano.io/api/v3/publisher/user/list?api_token=xeYjNEhmutkgkqCZyhBn6DErVntAKDx30FqFOS6D&aid=o1sRRZSLlw'
response = requests.post(url)

existingUsers = []
# Parse JSON into an object with attributes
x = json.loads(response.text, object_hook=lambda d: SimpleNamespace(**d))
for row in x.users:
    existingUsers.append(userA(row.uid,row.email))

for usersInA in dataA: #print( obj.user_id, obj.email, sep =' ' )
    for usersInB in dataB: #print( obj2.user_id, obj2.first_name, obj2.last_name, sep =' ' )
        if usersInA.user_id == usersInB.user_id:
            id = usersInA.user_id
            for y in existingUsers:
                if y.email == usersInA.email:
                    id = y.user_id
                    break
            mergedUsersData.append(mergedUsers(id,usersInA.email,usersInB.first_name,usersInB.last_name))
            break

header = ['user_id', 'email', 'first_name', 'last_name']

with open('/Users/arielmira/Desktop/Piano Assessment/Python/output_files/success.csv', 'w', encoding='UTF8', newline='') as f:
    writer = csv.writer(f)
    
    writer.writerow(header) # write the header

    for user in mergedUsersData:
        row = [user.user_id,user.email,user.first_name,user.last_name]
        writer.writerow(row)

    f.close() # close the file