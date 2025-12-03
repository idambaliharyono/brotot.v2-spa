
<script lang="ts">
	import { form } from "$app/server";
	import { loadAllData, Members, MembershipStatus } from "$lib/globalState";
	import { supabase, uploadToCloudinary } from "$lib/helper";
    import { type Member, type membership_status, type Transaction } from "$lib/types";
	import { createEventDispatcher, onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import { load } from "../members/+page";
	import { promise } from "zod";

    // export let selectedMember:membership_status;
    let { selectedMember } = $props<{ selectedMember: membership_status}>()
    let memberData = $derived<undefined | Member>($Members[selectedMember?.member_id])

    
    let formData = $derived({
        nick_name: memberData?.nick_name,
        full_name: memberData?.full_name,
        gender: memberData?.gender,
        birth_date: memberData?.birth_date,
        phone_number: memberData?.phone_number,
        medical_info: memberData?.medical_info,
        fitness_goal: memberData?.fitness_goal,
        prefered_workout: memberData?.prefered_workout,
        photo_url: memberData?.photo_url,
    })

    let modalRef : HTMLDialogElement;
    const dispatch = createEventDispatcher()
    onMount(() => {
        modalRef.showModal();
        modalRef.addEventListener("close", () => {
            dispatch("close")
        })
    })

    

    let nickName = $state(memberData?.nick_name);
    let fullName = $state(memberData?.full_name); 
    let gender = $state(memberData?.gender); 
    let birthdate = $state(memberData?.birth_date);
    let phoneNumber = $state(memberData?.phone_number);
    let medicalInfo = $state(memberData?.medical_info);
    let fitnessGoal = $state(memberData?.fitness_goal);
    let preferedWorkoutTime = $state(memberData?.prefered_workout);
    let photoUrl= $state(memberData?.photo_url) 
    let photo : File |null = null;
    let loadingCloudinary = false;
    let loadingSupabase = false;

    async function handleSubmit(e: Event) {
        e.preventDefault();
        loadingSupabase = true;

        
        // 1. handle photo, if there photo upload to cloudinary then use that url, if not, use existing photo url
        
        try {
        let finalPhotoUrl = photoUrl
        if (photo) { 
            loadingCloudinary = true
            try {
                const uploadRes = await uploadToCloudinary(photo)
                finalPhotoUrl = uploadRes.secure_url;

            } catch(err) {
                toast.error('faied uploading photo to cloud')
                return;
            } finally {
                loadingCloudinary = false
            }
        } 

        // 2. update database 
        const editPayload = {
            nick_name: nickName,
            full_name: fullName,
            gender: gender, 
            birth_date: birthdate ?`${new Date(birthdate).toISOString().split("T")[0]}` : null,
            phone_number: phoneNumber,
            medical_info: medicalInfo, 
            fitness_goal: fitnessGoal,
            prefered_workout_time: preferedWorkoutTime,
            photo_url: finalPhotoUrl,
            } 
        
        const { data, error } = await supabase
            .from('Members')
            .update(editPayload)
            .eq('member_id', selectedMember.member_id)
            .select()
            .single()
        if ( error ) throw error 
        
        // 3. update store
        Members.update(members => ({
            ...members, [selectedMember.member_id]:{
                ...data,
                birth_date: data.birth_date? data.birth_date : null,
            }
        }))

        MembershipStatus.update(members => ({
            ...members, [selectedMember.member_id]: {
                ...members[selectedMember.member_id],
                nick_name: data.nick_name,
                full_name: data.full_name,
                phone_number: data.phone_number,
                photo_url: data.photo_url,
            }
        }))

        
        // 4. success
        toast.success(`${selectedMember.nick_name}'s data, Successfully edited'`)
        modalRef.close()

        } catch(error: any) {
            console.error('submit error:', error)
            toast.error(`Update failed ${error.message}`)
        } finally {
            loadingSupabase = false
        }
    } 

    
</script>
<dialog bind:this={modalRef} class="modal">
  <div class="modal-box max-w-2xl">
    <!-- Header -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold">Edit Member Information</h2>
      <p class="text-gray-500">Update {nickName}'s details</p>
    </div>

    <!-- Current Photo & Upload -->
    <div class="flex items-center gap-6 mb-8">
      <div class="avatar">
        <div class="w-24 h-24 rounded-full ring ring-primary ring-offset-2">
          <img src={photoUrl || '/default-avatar.png'} alt={nickName} />
        </div>
      </div>
      <div class="flex-1">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text font-semibold">Profile Picture</span>
          </div>
          <input
            type="file"
            accept="image/*"
            class="file-input file-input-bordered file-input-sm w-full"
            on:change={(e) => {
              const target = e.target as HTMLInputElement;
              photo = target.files?.[0] || null;
            }}
          />
          <div class="label">
            <span class="label-text-alt text-gray-500">Leave empty to keep current photo</span>
          </div>
        </label>
      </div>
    </div>

    <!-- Form -->
    <!-- svelte-ignore component_name_lowercase -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <!-- Full Name & Nickname -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Full Name</span>
          </label>
          <input
            type="text"
            class="input input-bordered"
            bind:value={fullName}
            placeholder="Enter full name"
            required
          />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Nickname</span>
          </label>
          <input
            type="text"
            class="input input-bordered"
            bind:value={nickName}
            placeholder="Enter nickname"
            required
          />
        </div>
      </div>

      <!-- Birth Date & Phone -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Birth Date</span>
          </label>
          <input
            type="date"
            class="input input-bordered"
            bind:value={birthdate}
            required
          />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Phone Number</span>
          </label>
          <input
            type="tel"
            class="input input-bordered"
            bind:value={phoneNumber}
            placeholder="+62 812-3456-7890"
            required
          />
        </div>
      </div>

      <!-- Gender -->
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Gender</span>
        </label>
        <div class="flex gap-6">
          <label class="cursor-pointer label justify-start gap-2">
            <input
              type="radio"
              name="gender"
              class="radio radio-primary"
              value="Male"
              bind:group={gender}
            />
            <span class="label-text">Male</span>
          </label>
          <label class="cursor-pointer label justify-start gap-2">
            <input
              type="radio"
              name="gender"
              class="radio radio-primary"
              value="Female"
              bind:group={gender}
            />
            <span class="label-text">Female</span>
          </label>
        </div>
      </div>

      <!-- Medical Info & Fitness Goal -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Medical Information</span>
          </label>
          <textarea
            class="textarea textarea-bordered h-24"
            bind:value={medicalInfo}
            placeholder="Any medical conditions, allergies, or notes..."
          />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Fitness Goal</span>
          </label>
          <input
            type="text"
            class="input input-bordered"
            bind:value={fitnessGoal}
            placeholder="e.g., Weight loss, Muscle gain, General fitness"
          />
        </div>
      </div>

      <!-- Preferred Workout Time -->
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Preferred Workout Time</span>
        </label>
        <select class="select select-bordered" bind:value={preferedWorkoutTime}>
          <option value="morning" selected={preferedWorkoutTime === 'morning'}>
            Morning
          </option>
          <option value="noon" selected={preferedWorkoutTime === 'noon'}>
            Noon
          </option>
          <option value="afternoon" selected={preferedWorkoutTime === 'afternoon'}>
            Afternoon
          </option>
          <option value="dusk" selected={preferedWorkoutTime === 'dusk'}>
            Dusk
          </option>
          <option value="night" selected={preferedWorkoutTime === 'night'}>
            Night
          </option>
        </select>
      </div>

      <!-- Form Actions -->
      <div class="modal-action mt-8">
        <button type="button" class="btn" on:click={() => modalRef.close()}>
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" disabled={loadingSupabase}>Submit
        </button>
      </div>
    </form>
  </div>

  <!-- Backdrop Close -->
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>    