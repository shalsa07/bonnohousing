import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * Email API Route
 * Handles sending emails for contact forms and loan prequalification
 */

export async function POST(request) {
    try {
        const body = await request.json();
        const { type, formData } = body;

        // Validate required fields
        if (!type || !formData) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if SMTP is configured
        const smtpHost = process.env.EMAIL_SERVER_HOST || process.env.SMTP_HOST;
        const smtpPort = process.env.EMAIL_SERVER_PORT || process.env.SMTP_PORT;
        const smtpUser = process.env.EMAIL_SERVER_USER || process.env.SMTP_USER;
        const smtpPass = process.env.EMAIL_SERVER_PASSWORD || process.env.SMTP_PASS;

        // Log configuration status (without exposing sensitive data)
        console.log('SMTP Configuration Check:', {
            host: smtpHost ? '✓ Configured' : '✗ Missing',
            port: smtpPort ? '✓ Configured' : '✗ Missing',
            user: smtpUser ? '✓ Configured' : '✗ Missing',
            pass: smtpPass ? '✓ Configured' : '✗ Missing',
        });

        if (!smtpHost || !smtpUser || !smtpPass) {
            const missingVars = [];
            if (!smtpHost) missingVars.push('EMAIL_SERVER_HOST');
            if (!smtpUser) missingVars.push('EMAIL_SERVER_USER');
            if (!smtpPass) missingVars.push('EMAIL_SERVER_PASSWORD');

            console.error('SMTP Configuration Error: Missing environment variables:', missingVars);

            // In development, log the email content instead of failing
            if (process.env.NODE_ENV === 'development') {
                console.log('\n=== EMAIL WOULD BE SENT (Development Mode) ===');
                console.log('From:', formData.email);
                console.log('Type:', type);
                console.log('Data:', JSON.stringify(formData, null, 2));
                console.log('===========================================\n');

                return NextResponse.json({
                    success: true,
                    message: 'Email logged to console (SMTP not configured)',
                    development: true,
                });
            }

            return NextResponse.json(
                {
                    error: 'SMTP not configured',
                    details: `Missing environment variables: ${missingVars.join(', ')}`,
                    hint: 'Please configure SMTP settings in .env.local file',
                },
                { status: 503 }
            );
        }

        // Create transporter with SMTP settings
        const transporterConfig = {
            host: smtpHost,
            port: parseInt(smtpPort || '587'),
            secure: smtpPort === '465', // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        };

        console.log('Creating SMTP transporter with config:', {
            host: smtpHost,
            port: transporterConfig.port,
            secure: transporterConfig.secure,
            user: smtpUser?.substring(0, 3) + '***', // Partially masked
        });

        const transporter = nodemailer.createTransport(transporterConfig);

        // Verify transporter configuration
        try {
            await transporter.verify();
            console.log('✓ SMTP connection verified successfully');
        } catch (verifyError) {
            console.error('SMTP Verification Failed:', {
                message: verifyError.message,
                code: verifyError.code,
                command: verifyError.command,
            });

            return NextResponse.json(
                {
                    error: 'SMTP connection failed',
                    details: verifyError.message,
                    hint: 'Please check your SMTP credentials and server settings',
                },
                { status: 503 }
            );
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'info@ppsbluyari.com';
        const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_FROM || smtpUser;

        let adminEmailContent = '';
        let userEmailContent = '';
        let subject = '';

        // Generate email content based on form type
        if (type === 'contact') {
            subject = 'New Contact Form Submission';
            adminEmailContent = generateContactAdminEmail(formData);
            userEmailContent = generateContactUserEmail(formData);
        } else if (type === 'loan') {
            subject = 'New Loan Prequalification Submission';
            adminEmailContent = generateLoanAdminEmail(formData);
            userEmailContent = generateLoanUserEmail(formData);
        } else {
            return NextResponse.json(
                { error: 'Invalid form type' },
                { status: 400 }
            );
        }

        // Send email to admin
        try {
            console.log(`Sending admin email to: ${adminEmail}`);
            await transporter.sendMail({
                from: fromEmail,
                to: adminEmail,
                subject: subject,
                html: adminEmailContent,
            });
            console.log('✓ Admin email sent successfully');
        } catch (mailError) {
            console.error('Failed to send admin email:', mailError);
            throw new Error(`Failed to send admin email: ${mailError.message}`);
        }

        // Send acknowledgment email to user
        if (formData.email) {
            try {
                console.log(`Sending acknowledgment email to: ${formData.email}`);
                await transporter.sendMail({
                    from: fromEmail,
                    to: formData.email,
                    subject: 'Thank you for contacting PPSB Luyari',
                    html: userEmailContent,
                });
                console.log('✓ User acknowledgment email sent successfully');
            } catch (mailError) {
                console.error('Failed to send user email:', mailError);
                // Don't fail the whole request if user email fails
                console.warn('Admin email was sent, but user acknowledgment failed');
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
        });

    } catch (error) {
        console.error('Email sending error:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
        });

        return NextResponse.json(
            {
                error: 'Failed to send email',
                details: error.message,
                hint: 'Check server logs for more details',
            },
            { status: 500 }
        );
    }
}

// Generate admin email for contact form
function generateContactAdminEmail(data) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0099FF; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #79A627; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name} ${data.surname}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${data.email}</div>
          </div>
          <div class="field">
            <div class="label">Phone Number:</div>
            <div class="value">${data.phone}</div>
          </div>
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${data.message}</div>
          </div>
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date().toLocaleString()}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate user acknowledgment email for contact form
function generateContactUserEmail(data) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0099FF; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background: #f9f9f9; padding: 15px; text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Contacting Us</h2>
        </div>
        <div class="content">
          <p>Dear ${data.name} ${data.surname},</p>
          <p>Thank you for reaching out to PPSB Luyari. We have received your message and one of our team members will get back to you shortly.</p>
          <p>We appreciate your interest in our services and look forward to assisting you.</p>
          <p><strong>Your message:</strong></p>
          <p style="padding: 15px; background: #f9f9f9; border-left: 3px solid #79A627;">${data.message}</p>
          <p>Best regards,<br>
          <strong>PPSB Luyari Team</strong></p>
        </div>
        <div class="footer">
          <p>PPSB Luyari | Building the Future of Southern Africa</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate admin email for loan prequalification
function generateLoanAdminEmail(data) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #79A627; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; color: #0099FF; margin-bottom: 10px; font-size: 16px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 8px; background: white; border-left: 3px solid #0099FF; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Loan Prequalification Submission</h2>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.name} ${data.surname}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone}</div>
            </div>
          </div>
          
          ${data.income ? `
          <div class="section">
            <div class="section-title">Financial Information</div>
            <div class="field">
              <div class="label">Monthly Income:</div>
              <div class="value">${data.income}</div>
            </div>
            ${data.employment ? `
            <div class="field">
              <div class="label">Employment Status:</div>
              <div class="value">${data.employment}</div>
            </div>
            ` : ''}
            ${data.loanAmount ? `
            <div class="field">
              <div class="label">Desired Loan Amount:</div>
              <div class="value">${data.loanAmount}</div>
            </div>
            ` : ''}
          </div>
          ` : ''}
          
          ${data.propertyType || data.location ? `
          <div class="section">
            <div class="section-title">Property Interest</div>
            ${data.propertyType ? `
            <div class="field">
              <div class="label">Property Type:</div>
              <div class="value">${data.propertyType}</div>
            </div>
            ` : ''}
            ${data.location ? `
            <div class="field">
              <div class="label">Preferred Location:</div>
              <div class="value">${data.location}</div>
            </div>
            ` : ''}
          </div>
          ` : ''}
          
          ${data.message ? `
          <div class="section">
            <div class="section-title">Additional Information</div>
            <div class="field">
              <div class="value">${data.message}</div>
            </div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date().toLocaleString()}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate user acknowledgment email for loan prequalification
function generateLoanUserEmail(data) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #79A627; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background: #f9f9f9; padding: 15px; text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Your Interest</h2>
        </div>
        <div class="content">
          <p>Dear ${data.name} ${data.surname},</p>
          <p>Thank you for submitting your loan prequalification request with PPSB Luyari.</p>
          <p>We have received your information and our financial team will review your application. One of our loan specialists will contact you within 2-3 business days to discuss the next steps.</p>
          <p><strong>What happens next:</strong></p>
          <ul>
            <li>Our team will review your prequalification information</li>
            <li>We'll assess your eligibility for financing options</li>
            <li>A loan specialist will contact you to discuss available options</li>
            <li>We'll guide you through the complete application process</li>
          </ul>
          <p>If you have any urgent questions, please don't hesitate to contact us at info@ppsbluyari.com</p>
          <p>Best regards,<br>
          <strong>PPSB Luyari Financial Team</strong></p>
        </div>
        <div class="footer">
          <p>PPSB Luyari | Building the Future of Southern Africa</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
