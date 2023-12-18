FROM ubuntu

RUN apt-get update && apt-get install -y git openjdk-17-jdk
WORKDIR /app
RUN git clone --recursive https://github.com/traccar/traccar.git
WORKDIR /app/traccar
RUN ./gradlew assemble
RUN mkdir conf
RUN cp setup/default.xml conf/
RUN mkdir logs

CMD ["java", "-jar", "target/tracker-server.jar", "setup/traccar.xml"]