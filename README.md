# Mining
Mining monitoring using Telemetry

This repository contains 4 projects

a. MiningManagement : This provides API to create Miners in the system

b. Producer: This provides API to pull telemetry from Miners

c. Collector: This service invokes the producer API on a cadence and queues it. Also exposes an API for adhoc pulling

d. Change-Detector: This service listens to the queue and processes each record as it arrives.
