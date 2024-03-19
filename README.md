# eslint-encode-rule
Custom eslint rule to capture non-encoding JavaScript variable inclusion in HTML String construction

#Steps to generate encoding reports

1. Download the repo,  and extract the zip

2. Open the terminal at the extracted folder and execute the following commands.
```npm init```
```npm install```
```npm add --dev file:./custom-rule-missing-encoding``` (Execute it only for the first time)

```npx eslint <Absolute-Project-Path>/webapps  --ext .js```

This will give you a report of Encoding missing places in all of the JS files.

To write the report in the text file, execute the below command.

```npx eslint <Project-Name>/webapps  --ext .js > report.txt```
