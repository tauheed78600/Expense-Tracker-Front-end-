import React from 'react';
import '../styles/Homepage.css'
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom'; 
import "../styles.css";

const Homepage = () => {
  return (
    <>
     <Helmet>
        <title>MoneyMentor - Homepage</title>
        <meta name="description" content="Track your expenses easily with MoneyMentor." />
        <script defer src="https://use.fontawesome.com/releases/v5.0.7/js/all.js"></script>
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
      </Helmet>
    <div className="container-fluid">
      {/* Nav Bar */}
        <nav className="navbar border shadow p-3  bg-white rounded">
            <Link to = "/" className="navbar-brand">MoneyMentor</Link>
            {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" >
            <span className="navbar-toggler-icon"><i className="fa-solid fa-bars"/></span>
            </button> */}
            {/* <div className="collapse navbar-collapse" id="navbarSupportedContent"> */}
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                    {/* Use the Link component for navigation */}
                    <Link className="nav-link" to="/auth">Login/Register</Link>
                    </li>
                </ul>
            {/* </div> */}
        </nav>

      {/* Title */}
      <div className="row1">
            <div className='col'>
            <div className="col-lg-6 col-md-12 col-sm-12">
          <h1><pre>Track</pre>
          <pre>Your Expenses</pre>  
          <pre>Easily With</pre> <span className="nameColor">MoneyMentor</span></h1>
        </div>
        { <div className="col-lg-6 col-md-12 col-sm-12">
          <img src="icons-expense-tracker.svg" alt="iphone-mockup" className="iphone-img" />
        </div> }
            </div>
      </div>

      {/* Features */}
      <section id="features">
        <div className="row">
          <div className="feature-box col-lg-4 col-md-12 col-sm-12">
            <i className="fas fa-check-circle icon fa-5x"></i>
            <h3>Easy to use.</h3>
            <p>Effortlessly track your expenses with our user-friendly interface.</p>
          </div>
          <div className="feature-box col-lg-4 col-md-12 col-sm-12">
            <i className="fas fa-bullseye icon fa-5x"></i>
            <h3>Customized Budgeting</h3>
            <p>Ability to tailor budgets to individual needs and goals.</p>
          </div>
          <div className="feature-box col-lg-4 col-md-12 col-sm-12">
            <i className="fas fa-heart icon fa-5x"></i>
            <h3>Expense Categorization</h3>
            <p>Categorize and manage expenses for better organization.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
       <section id="testimonials">
        
        <div id="carouselExampleControls" className="carousel slide" data-ride="false">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <h2>
                Love the app! It's so user-friendly and has really helped me manage my finances better. Thanks!
              </h2>
              <br/>
              <img className="testimonial-img" src="feedback1.jpg" alt="man-profile" /> <br/>
              <em>Pebbles, New York</em>
            </div>
            <div className="carousel-item">
              <h2 className="testimonial-text">
                Great app! Really helped me stay on top of my expenses. Thank you!
              </h2>
              <br/>
              <img className="testimonial-img" src="lady-img.jpg" alt="lady-profile" />
              <br/>
              <em>Beverly, Illinois</em>
            </div>
          </div>
          <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </section> 


  {/* Hello world */}
  
      

      {/* Press */}
      <section id="press">
            <div className='press1'>
            <img className="press-img" src="techcrunch.png" alt="tc-logo" />
        <img className="press-img" src="tnw.png" alt="tnw-logo" />
        <img className="press-img" src="bizinsider.png" alt="biz-insider-logo" />
        <img className="press-img" src="mashable.png" alt="mashable-logo" />
            </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <h2>What We Offer</h2>
        <p>Our Range of Services</p>
        <div className="row">
          <div className="col-lg-4 col-md-6 pricing-column">
            <div className="card">
              <div className="card-header">
                <h3>Expense Tracking</h3>
              </div>
              <div className="card-body">
                <p>Customizable reports</p>
                <p>Detailed categorization</p>
                <p>Streamlined expense entry</p>
                <p>Recurring expense management</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 pricing-column">
            <div className="card">
              <div className="card-header">
                <h3>Budget Tracking</h3>
              </div>
              <div className="card-body">
                <p>Real-time updates</p>
                <p>Goal-based options</p>
                <p>Automated allocation</p>
                <p>Customizable budget creation</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 pricing-column">
            <div className="card">
              <div className="card-header">
                <h3>Analytics</h3>
              </div>
              <div className="card-body">
                <p>Trend analysis</p>
                <p>Data visualization</p>
                <p>Forecasting and projections</p>
                <p>Customizable reporting options</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta">
        <h1>Effortlessly Monitor All Your Expenses in One Place💜</h1>
      </section>

      {/* Footer */}
      <footer id="footer">
        <div className="social">
          <h1 className="feed-head">Feedback Form</h1>
          <form id="feedbackForm">
            <div className="form-group">
              <label htmlFor="formGroupExampleInput">Full Name</label>
              <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Full Name" />
            </div>
            <div className="form-group">
              <label htmlFor="formGroupExampleInput2">Feedback</label>
              <input type="text" className="form-control" id="formGroupExampleInput2" placeholder="Feedback Message" />
            </div>
            <button type="" className="submitMail btn-primary mb-2">Submit</button>
          </form>
          <p className="copyright">© Copyright   2024 Parkar Digital</p>
          <p>Made with ❤</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Homepage;
