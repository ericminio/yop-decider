FROM node:22.21.1-alpine3.21

RUN apk update && apk add \
    tzdata

ENV TZ="America/Los_Angeles"
ENV PS1='\n$(date +%H:%M:%S)\n\[\e[32m\]\u \[\e[33m\]in \w\[\e[0m\] \n> '

WORKDIR /home/node

