The sample project shows the components of a basic Vert.x project laid out in different
subdirectories according to Maven best practices.

**1. Examine the Maven project structure.**

> Click on the `tree` command below to automatically copy it into the terminal and execute it

``tree``{{execute}}

```sh
.
├── pom.xml
└── src
    └── main
        ├── fabric8
        ├── java
        │   └── com
        │       └── redhat
        │           └── coolstore
        │               ├── model
        │               │   ├── Product.java
        │               │   ├── ShoppingCart.java
        │               │   ├── ShoppingCartItem.java
        │               │   └── impl
        │               │       ├── ProductImpl.java
        │               │       ├── ShoppingCartImpl.java
        │               │       └── ShoppingCartItemImpl.java
        │               └── utils
        │                   ├── Generator.java
        │                   └── Transformers.java
        └── resources
            └── webroot
                └── index.html
```

>**NOTE:** To generate a similar project skeleton you can visit the [Vert.x Starter](http://start.vertx.io/) webpage.

If you have used Maven and Java before this should look familiar. This is how a typical Vert.x Java project would looks like. To save time we have provided the domain model, util classes for transforming and generating item, an index.html, and OpenShift configuration.

The domain model consists of a ShoppingCart which has many ShoppingCartItems which has a one-to-one dependency to Product. The domain also consists of Different Promotions that uses the ShoppingCart state to see if it matches the criteria of the promotion.

![Shopping Cart - Domain Model](/redhat-middleware-workshops/assets/reactive-microservices/cart-model.png)

