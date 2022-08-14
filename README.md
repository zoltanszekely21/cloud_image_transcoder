<h1 align="center"><img src="/assets/aws.png" alt="AWS" width=130 height=130></h1>

<h2 align="center">Highly scalable cloud-based image transcoding solution with <a href="https://aws.amazon.com/" target="_blank">Amazon Web Services</a>.</h2>

## [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)

The AWS Well-Architected Framework helps us understand the pros and cons of decisions we make while building systems on AWS. It presents architectural best practices for designing and operating reliable, secure, efficient, and cost-effective systems in the cloud.

### Main Pillars:

● Operational Excellence: support development/run workflows effectively 

● Security: protect data, systems and assets

● Reliability: correct and consistent

● Performance Efficiency: using resources efficiently to meet system requirements

● Cost Optimization: business value @ lowest price point

● Sustainability: reduce energy consumption

## Tools used:
![S3](/assets/s3.png)
#### S3
- Scalable: S3 scales with our application. Since we pay only for what we use, there is no limit to the data we can store in S3.
This is helpful during multiple scenarios, especially during an unexpected surge in user growth. You don’t have to buy extra space. 

- Secure: By default.: S3 locks up all our data with high security unless we explicitly configure not to. S3 also maintains compliance programs, such as PCI-DSS, HIPAA/HITECH, FedRAMP, EU Data Protection Directive, and FISMA, to help you meet your industry’s regulatory requirements

- Versioning: We can also retrieve accidentally deleted files when we enable versioning with S3. We need to take into account when we integrate versioning, we are storing multiple copies of the same document. This can have an effect on pricing as well as read/write requests we make.

- Durable: S3 provides a highly durable storage infrastructure. It redundantly stores data in multiple facilities, making our data safe in the event of a system failure. S3 also performs regular data integrity checks to make sure your data is intact.

![Lambda](/assets/aws-lambda.png)
#### Lambda
- Lambda’s architecture can deliver great benefits over traditional cloud computing setups for applications where: individual tasks run for a short time;
each task is generally self-contained; there is a large difference between the lowest and highest levels in the workload of the application.

- Some of the most common use cases for AWS Lambda that fit these criteria are: 
- Scalable APIs. When building APIs using AWS Lambda, one execution of a Lambda function can serve a single HTTP request. Different parts of the API can be routed to different Lambda functions via Amazon API Gateway. AWS Lambda automatically scales individual functions according to the demand for them, so different parts of our API can scale differently according to current usage levels. This allows for cost-effective and flexible API setups.

![APIGW](/assets/)
#### API Gateway
- Amazon API Gateway is an AWS service for creating, publishing, maintaining, monitoring, and securing REST, HTTP, and WebSocket APIs at any scale. API developers can create APIs that access AWS or other web services, as well as data stored in the AWS Cloud. We can create APIs for use in our own client applications or we can make our APIs available to third-party app developers. 

- API Gateway creates RESTful APIs that: Are HTTP-based | Enable stateless client-server communication. | Implement standard HTTP methods such as GET, POST, PUT, PATCH, and DELETE.

![Cloudfront](/assets/cf.png)
#### CloudFront
Benefits of AWS CloudFront:
- It will cache your content in edge locations and decrease the workload, thus resulting in high availability of applications.
- It is simple to use and ensures productivity enhancement.
- It provides high security with the ‘Content Privacy’ feature.
- It facilitates GEO targeting service for content delivery to specific end-users.
- It uses HTTP or HTTPS protocols for quick delivery of content.
- It is less expensive, as it only charges for the data transfer.




