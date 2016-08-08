80Scan - Port 80/443 Scanning on Steroids
=========================================

80Scan is a port 80/443 scanner that searches HTTP response headers for user defined strings. This is useful for scanning IP addresses on a network (remember to get permissions!) for devices that have port 80/443 open.

Installing
----------

    git clone https://github.com/JamesTheHacker/80Scan
    cd 80Scan
    npm install

Usage
-----

By default 80Scan will search the body of the response for any needles (the HTML source):

    node 80scan.js --cidr 192.168.0.0/24 --needles needles.txt

You can also search the header response for any needles. Note that you can not search both at the same time:

    node 80scan.js --cidr 192.168.0.0/24 --needles needles.txt --headers

Needles
-------

**What are needles?**

Ever heard the term *looking for a needle in a haystack*? That's where the term comes from. The needles are what you're searching for, and the haystack is the response (the headers, or the body).

You can pass any text file to 80Scan, but each *needle* must be seperated by a new line. For example, here is a file that has common needles for web servers:

    nginx
    apache
    iis
    micro_httpd

If you pass this to 80Scan it will search the the response to check if they contain any of the above needles.
