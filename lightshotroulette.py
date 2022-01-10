#print screen roulette
import random
import string

#select 6 digits at random
digits = random.choices(string.digits, k=6)

#select 6 uppercase letters at random
letters = random.choices(string.ascii_lowercase, k=6)

#shuffle both letters + digits
sample = random.sample(digits + letters, 6)

result = "https://prnt.sc/" + '' .join(sample)
print(result)