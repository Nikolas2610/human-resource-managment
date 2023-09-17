<?php

namespace Tests\Feature;

use App\Mail\TestEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EmailTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_example()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function testSendTestEmail()
    {
        Mail::fake();  // Optional: mock the email sending for this test

        // Send the email
        Mail::to('npsillou@gmail.com')->send(new TestEmail());

        // Assertions to check if the email was sent
        Mail::assertSent(TestEmail::class);

        // Additional assertions...
    }
}
