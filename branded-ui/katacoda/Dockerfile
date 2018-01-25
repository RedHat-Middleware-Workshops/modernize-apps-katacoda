FROM golang:1.7
CMD ["./main"]
EXPOSE 3000
RUN mkdir -p /go/src/github.com/website
WORKDIR /go/src/github.com/website
ADD . /go/src/github.com/website
RUN go get && go build -a -installsuffix cgo -o main .
